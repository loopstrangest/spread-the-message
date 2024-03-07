import express from "express";
import axios from "axios";
import englishWords from "an-array-of-english-words/index.json" assert { type: "json" };
import { redisClient } from "../redis.js";

(async () => {
  try {
    const data = await redisClient.get("key");
  } catch (error) {
    console.error("Upstash error", error);
  }
})();

const router = express.Router();

//Route for save
router.post("/", async (request, response) => {
  try {
    const { word, ipAddress } = request.body;
    if (!word || !ipAddress) {
      response.status(400).send({ message: "Send all required fields" });
      return;
    }
    const lowercaseWord = word.toLowerCase();
    function wordToObject(word) {
      return { [word]: 1 };
    }
    const hashEntry = wordToObject(lowercaseWord);
    // Check if the word is a valid English word
    if (!englishWords.includes(lowercaseWord)) {
      response.status(400).send({ message: "Invalid English word" });
      return;
    }
    // Check if the word exists in the set for this IP address
    const memberExists = await redisClient.sismember(ipAddress, lowercaseWord);
    if (memberExists) {
      return response
        .status(409)
        .send({ message: "Word already posted by this IP address" });
    }
    // Add the word to the set for this IP address
    await redisClient.sadd(ipAddress, lowercaseWord);
    // Check if the word exists in the leaderboard
    const wordExists = await redisClient.hexists("leaderboard", lowercaseWord);
    if (wordExists) {
      // Increment the word count in the leaderboard hash
    } else {
      // Set the word count in the leaderboard hash to 1
      await redisClient.hset("leaderboard", { [lowercaseWord]: 1 });
      await redisClient.hincrby("leaderboard", lowercaseWord, 1);
    }

    return response.status(201).send({ word, ipAddress });
  } catch (error) {
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

//Route to get the user's IP address
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