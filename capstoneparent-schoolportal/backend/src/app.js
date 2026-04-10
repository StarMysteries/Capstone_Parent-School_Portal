const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { globalLimiter } = require("./middlewares/rateLimiter");
const parentsService = require("./services/parents.service");

const REGISTRATION_CLEANUP_INTERVAL_MS = 60 * 1000;
if (!global.__parentRegistrationCleanupTimer) {
  global.__parentRegistrationCleanupTimer = setInterval(async () => {
    try {
      await parentsService.purgeExpiredPendingRegistrations();
    } catch (error) {
      console.error(
        "[app] Failed to purge expired pending parent registrations",
        error,
      );
    }
  }, REGISTRATION_CLEANUP_INTERVAL_MS);

  global.__parentRegistrationCleanupTimer.unref?.();
}

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Apply global rate limiter to all API routes
app.use("/api", globalLimiter);

// Health check route (not rate-limited)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api", routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
