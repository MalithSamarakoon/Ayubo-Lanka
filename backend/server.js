// backend/server.js
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; // NEW
import receiptsRouter from "./routes/receipts.routes.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.routes.js";
import patientRouter from "./routes/patientRoutes.js";
import productRouter from "./routes/product.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// NEW: serve uploaded slips publicly (matches createReceipt fileUrl)
app.use("/uploads", express.static(path.resolve("uploads"))); // NEW

app.use("/api/receipts", receiptsRouter);
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/patients", patientRouter);

async function start() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected:", mongoose.connection.db.databaseName);
    app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));
  } catch (e) {
    console.error("DB connect failed:", e.message);
    process.exit(1);
  }
}
start();

export default app;
