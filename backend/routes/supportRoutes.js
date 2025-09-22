// backend/routes/supportRoutes.js
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import Support from "../models/Support.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload root exists (…/uploads/support)
const uploadRoot = path.join(__dirname, "..", "uploads", "support");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "file-" + unique + path.extname(file.originalname || ""));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    // allow .png .jpg .jpeg .pdf
    const extOk = /\.(png|jpe?g|pdf)$/i.test(file.originalname || "");
    const mimeOk = /(image\/png|image\/jpeg|application\/pdf)$/i.test(file.mimetype || "");
    return extOk && mimeOk
      ? cb(null, true)
      : cb(new Error("Only PNG, JPG, JPEG, PDF allowed"));
  },
});

// Create a new support inquiry (multipart/form-data)
router.post("/inquiry", upload.array("files", 5), async (req, res) => {
  // Debug
  console.log("---- POST /api/support/inquiry ----");
  console.log("BODY:", req.body);
  console.log(
    "FILES:",
    (req.files || []).map((f) => ({
      field: f.fieldname,
      original: f.originalname,
      stored: f.filename,
      mimetype: f.mimetype,
      size: f.size,
    }))
  );

  try {
    const { name, email, phone, inquiryType, subject, message } = req.body;

    const files = (req.files || []).map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/support/${f.filename}`, // public path under static mount
      size: f.size,
      mimetype: f.mimetype,
    }));

    const inquiry = await Support.create({
      name,
      email,
      phone,
      inquiryType,
      subject,
      message,
      files,
    });

    res.status(201).json({ message: "Inquiry submitted successfully", inquiry });
  } catch (error) {
    console.error("Error creating support inquiry:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// List
router.get("/inquiries", async (_req, res) => {
  try {
    const inquiries = await Support.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update
router.put("/inquiry/:id", async (req, res) => {
  try {
    const inquiry = await Support.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json({ message: "Inquiry updated successfully", inquiry });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete
router.delete("/inquiry/:id", async (req, res) => {
  try {
    const inquiry = await Support.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Stats
router.get("/stats/overview", async (_req, res) => {
  try {
    const [totalInquiries, newInquiries, inProgressInquiries, resolvedInquiries] = await Promise.all([
      Support.countDocuments(),
      Support.countDocuments({ status: "new" }),
      Support.countDocuments({ status: "in-progress" }),
      Support.countDocuments({ status: "resolved" }),
    ]);
    res.json({ totalInquiries, newInquiries, inProgressInquiries, resolvedInquiries });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Multer / validation errors for this router
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError || /(Only PNG, JPG, JPEG, PDF allowed)/i.test(err.message || "")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

export default router;
