<<<<<<< HEAD
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
=======
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

const uploadRoot = path.join(process.cwd(), "uploads", "receipts");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadRoot),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const name =
      Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    cb(null, name + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "application/pdf"].includes(
      file.mimetype
    );
    if (!ok) return cb(new Error("Invalid file type (JPG/PNG/PDF only)"));
    cb(null, true);
  },
});

const createLimiter = rateLimit({
  windowMs: 60_000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

const receiptsRouter = express.Router();

receiptsRouter.post("/", createLimiter, upload.single("file"), createReceipt);
receiptsRouter.get("/", listReceipts);
receiptsRouter.get("/:id", getReceipt);
receiptsRouter.patch("/:id/review", reviewReceipt);

receiptsRouter.use((err, req, res, next) => {
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

export default receiptsRouter;
>>>>>>> aec98d3a22f08de5b714e08766dae3575d78d779
