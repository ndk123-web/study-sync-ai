import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "./utils/ApiError.js";

const app = express();

// all middlewares will be here
// Explicit CORS preflight middleware to ensure headers are present
// Allow list can be provided via environment variable (comma-separated) for deployments.
// Example: ALLOWED_ORIGINS="https://study-sync-ai.vercel.app,https://localhost:5173"
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://localhost:5173",
      "http://localhost:3000",
      "https://localhost:3000",
      "https://study-sync-ai.vercel.app",
      "http://study-sync-ai.vercel.app",
      "https://studysync.ndkdev.me",
    ];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Lightweight debug logging for CORS preflight - helps in deployed environments
  // Remove or guard behind a DEBUG env var in production if verbose logs are unwanted.
  if (process.env.CORS_DEBUG === "true") {
    console.log("[CORS] incoming request", {
      method: req.method,
      origin,
      url: req.url,
    });
  }
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  }

  // Handle preflight
  if (req.method === "OPTIONS") {
    // Only respond with 204 if Origin is allowed and headers were set above
    if (origin && allowedOrigins.includes(origin)) {
      if (process.env.CORS_DEBUG === "true") {
        console.log(
          "[CORS] preflight accepted for origin",
          origin,
          "path",
          req.url
        );
      }
      return res.sendStatus(204);
    }

    // Preflight from an unknown origin - return 403 and log (browser will block)
    if (process.env.CORS_DEBUG === "true") {
      console.warn(
        "[CORS] preflight rejected for origin",
        origin,
        "path",
        req.url
      );
    }
    return res
      .status(403)
      .json({ success: false, message: "CORS origin not allowed" });
  }

  next();
});

// Still use the cors package for standard requests
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json({ limit: "30kb" })); // it means 30kb data will be allowed
app.use(express.urlencoded({ limit: "30kb", extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// This is a global error handler

// all imports routes will be here
import userRouter from "./routes/user.routes.js";
import coursesRouter from "./routes/course.routes.js";
import notesRouter from "./routes/notes.routes.js";
import chatRouter from "./routes/chat.routes.js";
import dashboardRouter from "./routes/dashboard.route.js";
import videoRouter from "./routes/video.routes.js";
import adminRouter from "./routes/admin.routes.js";
import certificateRouter from "./routes/certificate.routes.js";

// all routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/certificate", certificateRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(401).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // if unknown Error then
  return res.status(500).json({
    success: false,
    message: err.message,
    errors: err.errors,
  });
});

export default app;
