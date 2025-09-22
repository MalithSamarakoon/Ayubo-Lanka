// backend/routes/receipts.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { Receipt } from "../models/receipt.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// storage in /uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `slip_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });
const router = express.Router();

// POST /api/receipts  (field: slip)
router.post("/", upload.single("slip"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const url = `/uploads/${req.file.filename}`;
    const r = await Receipt.create({
      url,
      filename: req.file.filename,
      mime: req.file.mimetype,
      size: req.file.size,
      // uploadedBy: req.userId
    });

    res.status(201).json({ success: true, receipt: r });
  } catch (e) {
    console.error("receipt upload error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
