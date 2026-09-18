require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const audioRoutes = require("./routes/audioRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "https://nuzio-ai-xi.vercel.app/"
    ],
    credentials: true,
  }),
);

app.use(require("cookie-parser")());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    app: "Nuzio AI Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/user", userRoutes);
//home route
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Nuzio AI Backend ready to connect" });
});

// 404 handler
app.use("/*", (req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack || err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Nuzio AI Backend Server running on http://localhost:${PORT}`);
  console.log(`🎙️ ElevenLabs TTS ready with model: eleven_flash_v2_5`);
});
