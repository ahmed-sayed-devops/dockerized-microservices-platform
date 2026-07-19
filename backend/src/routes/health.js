const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "UP",
      database: "UP",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: "DOWN",
      database: "DOWN",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

module.exports = router;
