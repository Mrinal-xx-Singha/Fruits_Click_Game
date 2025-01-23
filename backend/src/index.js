import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import playerRoutes from "./routes/players.js";
import cookieParser from "cookie-parser";
import { setupSocketHandlers } from "./socket/handlers.js";
import { authenticateSocket } from "./middleware/auth.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});
//Middlewares
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);

// Socket.IO middleware
io.use(authenticateSocket);

// Socket.IO connection handling
setupSocketHandlers(io);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`MongoDB connection error:`, err));

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
