// backend/routes/receipts.routes.js
import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";

import {
  createReceipt,
  getReceipt,
  listReceipts,
  reviewReceipt,
} from "../controllers/receipts.controller.js";

// ensure upload dir exists: ./uploads/receipts
const uploadRoot = path.resolve("uploads", "receipts");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const name = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    cb(null, name + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "application/pdf"].includes(
      file.mimetype
    );
    cb(ok ? null : new Error("Invalid file type (JPG/PNG/PDF only)"), ok);
  },
});

const createLimiter = rateLimit({
  windowMs: 60_000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.post("/", createLimiter, upload.single("file"), createReceipt);
router.get("/", listReceipts);
router.get("/:id", getReceipt);
router.patch("/:id/review", reviewReceipt);

// multer + validation error handler for this router
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "File too large (max 5MB)" });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err && err.message?.startsWith("Invalid file type")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

export default router;
