import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "./utils/ApiError.js";

const app = express();

// Configure CORS based on environment
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://localhost:5173", 
      "https://study-sync-ai.vercel.app",
      "http://localhost:3000",
      "https://localhost:3000"
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log("Request with no origin allowed");
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed for origin: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false
};

// all middlewares will be here
app.use(cors(corsOptions));

app.use(express.json({ limit: "30kb" })); // it means 30kb data will be allowed
app.use(express.urlencoded({ limit: "30kb", extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Handle preflight requests for all routes
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With");
  res.sendStatus(200);
});

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

// Debug route to check CORS
app.get("/api/v1/debug/cors", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    origin: req.headers.origin,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

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
