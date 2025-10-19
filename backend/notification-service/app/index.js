import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie"; // npm install cookie
import admin from "../config/firebase-config.js"; // Firebase Admin SDK setup

// Allowed origins can be provided via env var (comma separated), otherwise fallback to dev + prod
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
const allowedOrigins = ALLOWED_ORIGINS
  ? ALLOWED_ORIGINS.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : [
      "http://localhost:5173",
      "http://localhost:4000",
      "https://studysync.ndkdev.me",
      "https://study-sync-ai.vercel.app",
      "https://study-sync-ai-auth-service.onrender.com",
    ];

const debugCors = process.env.CORS_DEBUG === "true";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true, // important to allow cookies
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// Map of userId -> Set of active socket instances
const userSockets = {}; // { [userId]: Set<Socket> }

// Helper to register a socket under a userId
function addUserSocket(userId, socket) {
  if (!userSockets[userId]) {
    userSockets[userId] = new Set();
  }
  userSockets[userId].add(socket);
}

// Helper to remove a socket (on disconnect)
function removeUserSocket(userId, socket) {
  const set = userSockets[userId];
  if (!set) return;
  set.delete(socket);
  if (set.size === 0) delete userSockets[userId];
}

// Helper to emit a notification to all active sockets for a user
function emitToUser(userId, eventName, payload) {
  const set = userSockets[userId];
  if (!set) {
    console.log(`[emitToUser] No active sockets for user ${userId}`);
    return false;
  }
  set.forEach((sock) => {
    sock.emit(eventName, payload);
  });
  return true;
}

io.use(async (socket, next) => {
  try {
    const rawCookie = socket.handshake.headers.cookie;
    if (!rawCookie) throw new Error("No cookie sent in handshake");

    const parsed = cookie.parse(rawCookie);
    const token = parsed.token; // Adjust cookie name if different

    if (!token) throw new Error("Auth token cookie 'token' missing");

    const decoded = await admin.auth().verifyIdToken(token);
    socket.userId = decoded.uid;
    next();
  } catch (err) {
    console.log("[Socket Auth] Firebase auth error:", err.message);
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log(`✅ User ${socket.userId} connected (socket ${socket.id})`);
  addUserSocket(socket.userId, socket);
  console.log(
    `[Connection] Active sockets for ${socket.userId}: ${[
      ...userSockets[socket.userId],
    ].map((s) => s.id)}`
  );

  socket.on("disconnect", (reason) => {
    removeUserSocket(socket.userId, socket);
    console.log(
      `🔌 Disconnected socket ${socket.id} for user ${
        socket.userId
      }. Reason: ${reason}. Remaining: ${
        userSockets[socket.userId] ? userSockets[socket.userId].size : 0
      }`
    );
  });
});

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// Explicit CORS preflight middleware to ensure headers are present and OPTIONS are handled
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (debugCors)
    console.log("[CORS] incoming", {
      method: req.method,
      origin,
      path: req.path,
    });

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

  if (req.method === "OPTIONS") {
    if (origin && allowedOrigins.includes(origin)) {
      if (debugCors)
        console.log("[CORS] preflight accepted for", origin, "path", req.path);
      return res.sendStatus(204);
    }
    if (debugCors)
      console.warn("[CORS] preflight rejected for", origin, "path", req.path);
    return res
      .status(403)
      .json({ success: false, message: "CORS origin not allowed" });
  }

  next();
});

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "notification-service" });
});

// Notification endpoint (invoked by Kafka consumer or internal systems)
// Supports both GET (simple) and POST (structured) usage
app.all("/notify/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    // Prefer body.message (POST) -> query.message (GET) -> fallback
    // Accept either direct event object or { message: string } or JSON string
    const body = req.body || {};
    const query = req.query || {};

    let candidate = body.event || body || query.message || body.message || null;
    let eventObject = null;
    if (candidate) {
      if (typeof candidate === "string") {
        try {
          eventObject = JSON.parse(candidate);
        } catch {
          /* keep null */
        }
      } else if (typeof candidate === "object") {
        eventObject = candidate;
      }
    }

    // Normalized fields
    const finalMessage =
      (eventObject && (eventObject.message || eventObject.msg)) ||
      body.message ||
      query.message ||
      "You have a new notification";

    const payload = {
      type: eventObject?.event || "notification",
      ts: Date.now(),
      message: finalMessage,
      // Provide raw event for consumers needing extra fields
      data: eventObject || undefined,
    };

    const delivered = emitToUser(userId, "notification", payload);
    console.log(
      delivered
        ? `📨 Delivered notification to user ${userId}:`
        : `⚠️ No active sockets for user ${userId}, notification queued (not really persisted).`,
      payload
    );

    return res.status(200).json({ delivered, payload });
  } catch (err) {
    console.error("/notify error:", err);
    return res.status(500).json({ error: "Internal notification error" });
  }
});

server.listen(4000, () => {
  console.log(
    "🚀 Notification WebSocket Service running on http://localhost:4000"
  );
});

// Export for potential test usage
export { io, server, emitToUser };
