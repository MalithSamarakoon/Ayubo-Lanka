// backend/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './lib/db.js';

import receiptsRouter from './routes/receipts.routes.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.routes.js';
import patientRouter from './routes/patientRoutes.js';
import productRouter from './routes/product.route.js';

import feedbackRoutes from './routes/feedbackRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import adminExportRoutes from "./routes/adminExportRoutes.js";
const app = express();
const PORT = process.env.PORT || 5000;

// --- DB ---
connectDB();

// --- Middleware ---
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5175'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use("/api/admin/export", adminExportRoutes);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// --- Static /uploads ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Health ---
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/receipts", receiptsRouter);
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/patients", patientRouter);

// --- Routes ---
app.use('/api/receipts', receiptsRouter);
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/patients', patientRouter);

app.use('/api/feedback', feedbackRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/tickets', ticketRoutes);
//----global error handler-----
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Payload too large" });
  }
  res.status(500).json({ message: "Server error", error: err?.message || String(err) });
});

// --- 404 Helper ---
app.use((req, res) => {
  res.status(404).json({
    message: 'Not found',
    path: `${req.method} ${req.originalUrl}`,
  });
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
