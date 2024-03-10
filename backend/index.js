import express from "express";
import wordsRoute from "./routes/wordsRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import errorHandler from "errorhandler";
import { redisClient } from "./redis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleware for handling CORS POLICY
app.use(
  cors({
    origin: ["localhost:5173", "https://spreadthemessage.strangestloop.io"],
    //origin: [FRONTEND_URL], // Specify the allowed origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify the allowed methods
    allowedHeaders: ["Content-Type"], // Specify the allowed headers
  })
);

app.use(errorHandler());

app.get("/", (request, response) => {
  return response.status(200).send("Spread the Message backend");
});

app.use("/words", wordsRoute);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "public")));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 4000; // Use the environment variable PORT or default to 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
