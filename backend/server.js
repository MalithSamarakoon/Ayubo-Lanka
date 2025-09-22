// backend/server.js
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/orders.routes.js"; 

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// --- Routes ---
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ Mount orders route (this removed your 404 "Route not found" on /api/orders)
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/orders", orderRouter);

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Fallback 404 for unknown API routes
app.use("/api", (_req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// Global error handler (keeps unhandled errors from crashing server)
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Server error" });
});

async function start() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("❌ Missing MONGO_URI in .env");
      process.exit(1);
    }

    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log("✅ Mongo connected:", mongoose.connection.db.databaseName);

    app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));
  } catch (e) {
    console.error("❌ DB connect failed:", e?.message || e);
    process.exit(1);
  }
}

start();

export default app;
