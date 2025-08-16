import express from 'express';
import 'dotenv/config';
import { connectDB } from './lib/db.js'; // Changed to named import
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    status: "Backend operational",
    dbStatus: mongoose.connection.readyState 
  });
});

// Startup
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('💥 Failed to start:', err.message);
    process.exit(1);
  }
};

start();
console.log("ENV VARS:", {
  MONGO_URI: process.env.MONGO_URI ? "exists" : "MISSING",
  PORT: process.env.PORT
});