require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// =======================================
// Health Check
// =======================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "notification-service",
    timestamp: new Date().toISOString(),
  });
});

// =======================================
// Alertmanager Webhook
// =======================================

app.post("/alert", async (req, res) => {
  console.log("==========================================");
  console.log("Webhook received");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("==========================================");

  try {
    const payload = req.body;

    if (!payload.alerts || payload.alerts.length === 0) {
      console.log("No alerts received.");
      return res.sendStatus(200);
    }

    for (const alert of payload.alerts) {

      const status = payload.status.toUpperCase();

      const alertName = alert.labels.alertname || "Unknown";
      const severity = alert.labels.severity || "unknown";
      const job = alert.labels.job || "N/A";
      const instance = alert.labels.instance || "N/A";

      const summary =
        alert.annotations.summary || "No Summary";

      const description =
        alert.annotations.description || "No Description";

      const startedAt = alert.startsAt
        ? new Date(alert.startsAt).toLocaleString()
        : "N/A";

      const severityEmoji = {
        critical: "🔴",
        warning: "🟠",
        info: "🔵",
      };

      const statusEmoji =
        status === "FIRING" ? "🚨" : "✅";

      // =======================================
      // Telegram Message
      // =======================================

      const telegramMessage = `
${statusEmoji} *${status}*

━━━━━━━━━━━━━━━━━━━━

🛑 *Alert*
${alertName}

${severityEmoji[severity] || "⚪"} *Severity*
${severity.toUpperCase()}

📦 *Job*
${job}

🖥️ *Instance*
${instance}

📝 *Summary*
${summary}

📄 *Description*
${description}

🕒 *Started*
${startedAt}

━━━━━━━━━━━━━━━━━━━━
🚀 *Docker Platform Monitoring*
`;

      // =======================================
      // Telegram
      // =======================================

      console.log("Sending Telegram message...");

      const telegramResponse = await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          chat_id: CHAT_ID,
          text: telegramMessage,
          parse_mode: "Markdown",
        }
      );

      console.log("Telegram response:");
      console.log(telegramResponse.data);

      // =======================================
      // Slack
      // =======================================

      if (SLACK_WEBHOOK_URL) {

        console.log("Sending Slack message...");

        const slackMessage = `
${statusEmoji} ${status}

━━━━━━━━━━━━━━━━━━━━

🛑 Alert
${alertName}

${severityEmoji[severity] || "⚪"} Severity
${severity.toUpperCase()}

📦 Job
${job}

🖥️ Instance
${instance}

📝 Summary
${summary}

📄 Description
${description}

🕒 Started
${startedAt}

━━━━━━━━━━━━━━━━━━━━
🚀 Docker Platform Monitoring
`;

        await axios.post(SLACK_WEBHOOK_URL, {
          text: slackMessage,
        });

        console.log("Slack Message Sent");

      } else {

        console.log("Slack Webhook not configured.");

      }

      console.log(
        `[${status}] ${alertName} (${severity}) -> Telegram & Slack`
      );
    }

    res.sendStatus(200);

  } catch (err) {

    console.error("==========================================");
    console.error("Notification Error");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }

    console.error("==========================================");

    res.sendStatus(500);
  }
});

// =======================================
// Start Server
// =======================================

app.listen(PORT, () => {
  console.log("==========================================");
  console.log(`Notification Service started on port ${PORT}`);
  console.log(`Telegram Chat ID: ${CHAT_ID}`);
  console.log(`Bot Token Loaded: ${BOT_TOKEN ? "YES" : "NO"}`);
  console.log(`Slack Loaded: ${SLACK_WEBHOOK_URL ? "YES" : "NO"}`);
  console.log("==========================================");
});
