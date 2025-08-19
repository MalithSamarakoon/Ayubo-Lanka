require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./lib/db");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/order", orderRoutes);

// Error handler (optional)
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// DB connection and listen
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>console.log(`Server running on port ${PORT}`)
);