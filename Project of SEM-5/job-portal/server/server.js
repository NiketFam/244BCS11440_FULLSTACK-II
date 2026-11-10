const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

dotenv.config();
const connectDB = require("./config/db");
connectDB();

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded resumes & files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root and Health routes
app.get("/", (req, res) => res.send("HireHub Job Portal API is running"));
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Main API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  if (err.message && err.message.includes("Only PDF and Word")) {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File size exceeds 5MB limit." });
  }
  res.status(err.status || 500).json({
    message: err.message || "An unexpected error occurred on the server.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`HireHub API running on port ${PORT}`));
