import { Redis } from "@upstash/redis";
import { REDIS_URL, REDIS_TOKEN } from "./urls.js";

export const redisClient = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
});
