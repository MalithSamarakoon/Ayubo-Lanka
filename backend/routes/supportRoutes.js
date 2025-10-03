import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import Support from "../models/Support.js";
import { sendInquiryStatusEmail } from "../mailer.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// /uploads/support
const uploadRoot = path.join(__dirname, "..", "uploads", "support");
fs.mkdirSync(uploadRoot, { recursive: true });

// ---- upload config ----
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "file-" + unique + path.extname(file.originalname || ""));
  },
});

const fileFilter = (_req, file, cb) => {
  if (!ALLOWED.has(file.mimetype)) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", `Unsupported file type: ${file.mimetype}`));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }, // 10MB/file, max 5
});

const unlinkSafe = async (abs) => { try { await fs.promises.unlink(abs); } catch {} };
const parseKeep = (v) => {
  if (!v) return [];
  try { const a = JSON.parse(v); return Array.isArray(a) ? a.filter(Boolean) : []; }
  catch { return String(v).split(",").map(s => s.trim()).filter(Boolean); }
};
const toAttachments = (files) =>
  (files || []).slice(0, 5).map(f => ({
    filename: f.originalName || f.filename,
    path: path.join(uploadRoot, f.filename),
  }));

// CREATE
router.post("/inquiry", upload.array("files", 5), async (req, res) => {
  try {
    const files = (req.files || []).map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/support/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype,
      uploadedAt: new Date(),
    }));
    const inquiry = await Support.create({ ...req.body, files, isApproved: false });
    res.status(201).json({ message: "Inquiry submitted successfully", inquiry });
  } catch (err) {
    console.error("Create inquiry error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// LIST
router.get("/inquiries", async (_req, res) => {
  try {
    const list = await Support.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET one
router.get("/inquiry/:id", async (req, res) => {
  try {
    const inquiry = await Support.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json(inquiry);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// UPDATE (keep[] + new files)
router.put("/inquiry/:id", upload.array("files", 5), async (req, res) => {
  try {
    const doc = await Support.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Inquiry not found" });

    const keep = parseKeep(req.body.keep);
    const kept = (doc.files || []).filter((f) => keep.includes(f.filename));
    const added = (req.files || []).map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/support/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype,
      uploadedAt: new Date(),
    }));

    // delete removed files from disk
    const removed = (doc.files || []).filter((f) => !keep.includes(f.filename));
    await Promise.all(removed.map((f) => unlinkSafe(path.join(uploadRoot, f.filename))));

    doc.set({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      inquiryType: req.body.inquiryType,
      subject: req.body.subject,
      message: req.body.message,
      files: [...kept, ...added],
    });
    await doc.save();

    res.json({ message: "Inquiry updated successfully", inquiry: doc });
  } catch (e) {
    console.error("Update inquiry error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// APPROVE / REJECT (email with attachments + pretty HTML)
router.patch("/inquiry/:id/approve", async (req, res) => {
  try {
    const next = !!req.body.isApproved;
    const inquiry = await Support.findByIdAndUpdate(
      req.params.id,
      { $set: { isApproved: next } },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    if (inquiry.email) {
      const attachments = toAttachments(inquiry.files);
      const links = (inquiry.files || []).map(f => `${process.env.APP_BASE_URL || ""}${f.path}`);
      await sendInquiryStatusEmail(inquiry.email, inquiry.name, inquiry.toObject(), next ? "approved" : "rejected", {
        attachments,
        links,
      });
    }

    res.json({ message: "Inquiry approval updated", inquiry });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch("/inquiry/:id/reject", async (req, res) => {
  try {
    const inquiry = await Support.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, status: "resolved" },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    if (inquiry.email) {
      const attachments = toAttachments(inquiry.files);
      const links = (inquiry.files || []).map(f => `${process.env.APP_BASE_URL || ""}${f.path}`);
      await sendInquiryStatusEmail(inquiry.email, inquiry.name, inquiry.toObject(), "rejected", {
        attachments,
        links,
      });
    }
    res.json({ message: "Inquiry rejected", inquiry });
  } catch (e) {
    console.error("Reject inquiry error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// DELETE
router.delete("/inquiry/:id", async (req, res) => {
  try {
    const doc = await Support.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Inquiry not found" });
    res.json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---- Multer error handler to prevent crashes ----
router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === "LIMIT_FILE_SIZE"   ? "File too large (max 10MB)" :
      err.code === "LIMIT_FILE_COUNT"  ? "Too many files (max 5)" :
      err.code === "LIMIT_UNEXPECTED_FILE" ? "Unsupported file type" :
      "Upload error";
    return res.status(400).json({ message: msg, error: err.message });
  }
  return res.status(500).json({ message: "Server error", error: err?.message || String(err) });
});

export default router;
