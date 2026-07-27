const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "backend",
    internal: true,
    instance: process.env.INSTANCE_NAME || "backend",
    timestamp: new Date().toISOString(),
  });
});

router.post("/cache/clear", (req, res) => {
  res.json({
    message: "Cache cleared successfully",
  });
});

module.exports = router;
