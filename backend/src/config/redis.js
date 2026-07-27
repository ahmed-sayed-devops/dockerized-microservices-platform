const { createClient } = require("redis");

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
