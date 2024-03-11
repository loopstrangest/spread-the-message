import express from "express";
import englishWords from "../englishWords.js";
import { redisClient } from "../redis.js";
import Filter from "bad-words";

const router = express.Router();

const filter = new Filter();

//Route for save
router.post("/", async (request, response) => {
  try {
    const { word, uuid } = request.body;
    if (!word || !uuid) {
      console.log("Missing fields: word or uuid is not provided");
      response.status(400).send({ message: "Send all required fields" });
      return;
    }
    console.log(`Received word: ${word} and uuid: ${uuid}`);
    const lowercaseWord = word.toLowerCase();
    function wordToObject(word) {
      return { [word]: 1 };
    }
    const hashEntry = wordToObject(lowercaseWord);
    console.log(`Converted word to lowercase: ${lowercaseWord}`);
    // Validate if the word is a recognized English word
    if (!englishWords.includes(lowercaseWord)) {
      console.log(`Word ${lowercaseWord} is not a recognized English word.`);
      response
        .status(200)
        .send({ message: "Provided word is not a recognized English word." });
      return;
    }
    if (filter.isProfane(lowercaseWord)) {
      console.log(`Word ${lowercaseWord} is profane.`);
      return response.status(400).send({ message: "Word is not allowed" });
    }
    // Verify if the word has already been submitted by this uuid
    const memberExists = await redisClient.sismember(uuid, lowercaseWord);
    console.log(
      `Checking if word ${lowercaseWord} has already been submitted by uuid ${uuid}: ${memberExists}`
    );
    if (memberExists) {
      response.status(200).send({
        message: "This word has already been submitted by this user.",
      });
      return;
    }
    // Add the word to the set for this uuid
    await redisClient.sadd(uuid, lowercaseWord);
    console.log(`Added word ${lowercaseWord} to set for uuid ${uuid}`);
    // Check if the word exists in the leaderboard
    const wordExists = await redisClient.hexists("leaderboard", lowercaseWord);
    console.log(
      `Checking if word ${lowercaseWord} exists in the leaderboard: ${wordExists}`
    );
    if (wordExists) {
      // Increment the word count in the leaderboard hash
      console.log(
        `Incrementing word count for ${lowercaseWord} in the leaderboard`
      );
    } else {
      // Set the word count in the leaderboard hash to 1
      await redisClient.hset("leaderboard", { [lowercaseWord]: 1 });
      console.log(
        `Setting word count for ${lowercaseWord} in the leaderboard to 1`
      );
    }
    console.log(
      `Successfully processed word ${lowercaseWord} for uuid ${uuid}`
    );
    return response.status(201).send({ word, uuid });
  } catch (error) {
    console.log("Error processing request:", error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for get all words
router.get("/", async (request, response) => {
  try {
    // Fetch all word counts from the "leaderboard" hash
    const wordCounts = await redisClient.hgetall("leaderboard");
    const words = Object.keys(wordCounts).map((word) => ({
      word,
      count: parseInt(wordCounts[word], 10),
    }));
    // Sort words by count in descending order
    words.sort((a, b) => b.count - a.count);
    return response.status(200).json({
      count: words.length,
      data: words,
    });
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
});

//Route to get the user's IP address (deprecated)
/*
router.get("/get-ip", (req, res) => {
  axios
    .get("https://api.ipify.org/?format=json")
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error fetching user's IP address:", error.message);
      res.status(500).json({ message: "Error fetching IP" });
    });
});
*/

//Route for getting the count of one specific word
router.get("/:word", async (request, response) => {
  try {
    const wordToFind = request.params.word;
    const keys = await redisClient.keys(`*${wordToFind}*`);
    const words = await Promise.all(keys.map((key) => redisClient.get(key)));
    const count = words.length;
    if (count > 0) {
      return response.status(200).json({
        word: wordToFind,
        count: count,
      });
    } else {
      return response.status(404).send({ message: "Word not found" });
    }
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
});

//Route to delete a word based on id
router.delete("/:id", async (request, response) => {
  try {
    const idToDelete = request.params.id;
    const deleted = await redisClient.del(idToDelete);
    if (deleted) {
      return response.status(200).json({
        message: "Word deleted successfully",
      });
    } else {
      return response.status(404).send({ message: "Word not found" });
    }
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
});

export default router;
