




import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes.js';
import videoRoutes from "./routes/videoRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import movieSearchRoutes from "./routes/searchRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import categoryRoutes from "./routes/categoryRoutes.js"; 

import reviewRoutes from "./routes/reviewRoutes.js";

import actorRoutes from "./routes/actorRoutes.js";

import userRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Active room data (optional for debugging)
const activeRooms = new Set();

// 🔌 Socket.IO setup
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // Join room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    activeRooms.add(roomId);
    console.log(`👤 ${username} joined room ${roomId}`);
    socket.to(roomId).emit("user-joined", `${username} joined`);
  });

  // Chat messaging
  socket.on("send-message", ({ roomId, username, message }) => {
    console.log(`Message in [${roomId}] from ${username}: ${message}`);
    io.to(roomId).emit("receive-message", { username, message });
  });

  // Video control (play/pause/sync)
  socket.on("video-action", ({ roomId, action, currentTime, videoUrl }) => {
    console.log(` Sync: [${roomId}] -> ${action} at ${currentTime.toFixed(2)}s [video: ${videoUrl}]`);
    socket.to(roomId).emit("sync-video", { action, currentTime, videoUrl });
  });

  // Respond to video sync request
  socket.on("request-video-state", ({ roomId }) => {
    console.log(` Received request to sync video in room ${roomId}`);
    // Broadcast to others to respond with their current video state
    socket.to(roomId).emit("request-video-state");
  });

  // Disconnect logging
  socket.on("disconnect", () => {
    console.log(" Socket disconnected:", socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/news", newsRoutes);
app.use("/movies/search", movieSearchRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/all-movies", categoryRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/actors", actorRoutes)

app.use('/users', userRoutes)


app.get("/", (req, res) => {
  res.send(" Watch Party API running");
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const PORT = process.env.PORT ;
httpServer.listen(PORT, () => {
  console.log(` Server running at :${PORT}`);
});
