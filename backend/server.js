// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Your frontend port
  credentials: true
}));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/feedbackdb";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is working and MongoDB connected!" });
});

// Import routes
const supportRoutes = require('./routes/supportRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use("/api/support", supportRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/tickets", ticketRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Frontend should connect to: http://localhost:${PORT}`);
});
