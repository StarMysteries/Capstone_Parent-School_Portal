import { createRequire } from "module";

// Load environment variables if a .env file is present (local dev only).
// In production (Railway), environment variables are injected directly.
try {
  const { default: dotenv } = await import("dotenv");
  const { fileURLToPath } = await import("url");
  const { default: path } = await import("path");
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, "backend", ".env") });
} catch {
  // dotenv not available in production — that's fine
}

const require = createRequire(import.meta.url);
const app = require("./backend/src/app.js");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  // Force exit if server hasn't closed within 10 seconds
  setTimeout(() => {
    console.error("Forcing shutdown after timeout.");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
