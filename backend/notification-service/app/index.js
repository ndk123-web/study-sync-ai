import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSockets = {};

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  // JWT from client
  socket.on("authenticate", (token) => {
    try {
      const payload = jwt.verify(token, "YOUR_SECRET_KEY");
      const userId = payload.userId;

      // store socketId in map
      if (!userSockets[userId]) userSockets[userId] = [];
      userSockets[userId].push(socket.id);

      console.log(`User ${userId} connected with socket ${socket.id}`);
    } catch (err) {
      console.log("Invalid token", err);
      socket.disconnect();
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    for (let userId in userSockets) {
      userSockets[userId] = userSockets[userId].filter(
        (id) => id !== socket.id
      );
      if (userSockets[userId].length === 0) delete userSockets[userId];
    }
    console.log("Client disconnected:", socket.id);
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Notification Service is running");
});

// Simulate sending notification (normally Kafka consumer will do this)
app.get("/notify/:userId", (req, res) => {
  const userId = req.params.userId;
  if (userSockets[userId]) {
    userSockets[userId].forEach((socketId) => {
      io.to(socketId).emit("notification", { message: "Hello from server!" });
    });
  }
  res.send("Notification sent");
});

server.listen(4000, () => {
  console.log("Notification Service is running on port 4000");
});
