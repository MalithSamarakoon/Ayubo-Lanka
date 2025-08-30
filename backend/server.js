// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();

/** CORS: allow any localhost port in dev or explicit FRONTEND_ORIGIN */
const DEV_LOCAL_REGEX = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;
const EXPLICIT_ORIGIN = process.env.FRONTEND_ORIGIN || null;

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                 // Postman / curl
    if (DEV_LOCAL_REGEX.test(origin)) return cb(null, true);
    if (EXPLICIT_ORIGIN && origin === EXPLICIT_ORIGIN) return cb(null, true);
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Global CORS (handles preflight too; no app.options("*") needed)
app.use(cors(corsOptions));

app.use(express.json());

// Ensure upload dirs exist
["uploads", "uploads/support", "uploads/tickets"].forEach((rel) => {
  const dir = path.join(__dirname, rel);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ayur_support";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Routes
const supportRoutes = require("./routes/supportRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

app.get("/", (req, res) => res.json({ message: "Server OK" }));
app.use("/api/support", supportRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/tickets", ticketRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Frontend should connect to: http://localhost:${PORT}`);
});
