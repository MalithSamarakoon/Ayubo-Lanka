import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./lib/db.js";

// Routers
import receiptsRouter from "./routes/receipts.routes.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.routes.js";
import patientRouter from "./routes/patientRoutes.js";
import productRouter from "./routes/product.route.js";
import ordersRouter from "./routes/orders.routes.js"; // ✅ NEW

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// DB
connectDB();

// CORS
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5174"].filter(Boolean),
    credentials: true,
  })
);

// Parsers
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API routes
app.use("/api/receipts", receiptsRouter);
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/patients", patientRouter);
app.use("/api/orders", ordersRouter); // ✅ NEW

// 404 for /api/*
app.use("/api", (req, res) => {
  return res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (optional)
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
