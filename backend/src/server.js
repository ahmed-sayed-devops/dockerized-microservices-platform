const express = require("express");
const client = require("prom-client");

const productsRouter = require("./routes/products");
const healthRouter = require("./routes/health");
const internalRouter = require("./routes/internal");

const app = express();

app.use(express.json());

/* ===========================
   Prometheus Metrics
=========================== */

// Create Registry
const register = new client.Registry();

// Collect Default Metrics
client.collectDefaultMetrics({
  register,
});

// HTTP Requests Counter
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// HTTP Request Duration Histogram
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
});

// Register Metrics
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);

// Request Metrics Middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });

    end({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
  });

  next();
});

// Prometheus Metrics Endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

/* ===========================
   Application Routes
=========================== */

// Root Endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running 🚀",
    instance: process.env.INSTANCE_NAME || "backend",
  });
});

// Public APIs

// Health
app.use("/api/health", healthRouter);

// Products
app.use("/api/products", productsRouter);

// Internal APIs (Protected by ForwardAuth)
app.use("/internal", internalRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `🚀 ${process.env.INSTANCE_NAME || "backend"} started on port ${PORT}`
  );
});
