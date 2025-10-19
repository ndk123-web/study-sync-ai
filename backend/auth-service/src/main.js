import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "./utils/ApiError.js";

const app = express();

// all middlewares will be here
app.use(
  cors({
    origin: ["http://localhost:5173", "https://study-sync-ai.vercel.app/"],
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
