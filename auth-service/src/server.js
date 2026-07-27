const express = require("express");

const app = express();

// =========================
// Configuration
// =========================

const PORT = process.env.AUTH_PORT || 3001;
const AUTH_API_KEY = process.env.AUTH_API_KEY || "ahmed-secret-key";

// =========================
// Verify API Key
// =========================

app.get("/verify", (req, res) => {
  const clientApiKey = req.header("X-API-Key");

  if (clientApiKey === AUTH_API_KEY) {
    return res.sendStatus(200);
  }

  return res.sendStatus(401);
});

// =========================
// Health Check
// =========================

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "auth-service",
  });
});

// =========================
// Start Server
// =========================

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
});
