// backend/routes/supportRoutes.js
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import Support from "../models/Support.js";
import {
  sendInquiryApprovedEmail,
  sendInquiryRejectedEmail,
} from "../mailer.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// /uploads/support
const uploadRoot = path.join(__dirname, "..", "uploads", "support");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "file-" + unique + path.extname(file.originalname || ""));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const unlinkSafe = async (abs) => { try { await fs.promises.unlink(abs); } catch {} };
const parseKeep = (v) => {
  if (!v) return [];
  try { const a = JSON.parse(v); return Array.isArray(a) ? a.filter(Boolean) : []; }
  catch { return String(v).split(",").map(s => s.trim()).filter(Boolean); }
};

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

// APPROVE (send email)
router.patch("/inquiry/:id/approve", async (req, res) => {
  try {
    const next = "approved" in req.body ? !!req.body.approved : !!req.body.isApproved;
    const inquiry = await Support.findByIdAndUpdate(
      req.params.id,
      { isApproved: next },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    if (inquiry.email && next) {
      await sendInquiryApprovedEmail(inquiry.email, inquiry.name, inquiry);
    }
    res.json({ message: "Inquiry approval updated", inquiry });
  } catch (e) {
    console.error("Approve inquiry error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// REJECT (optional) — sets status closed + email
router.patch("/inquiry/:id/reject", async (req, res) => {
  try {
    const inquiry = await Support.findByIdAndUpdate(
      req.params.id,
      { status: "resolved", isApproved: false }, // or use a dedicated "closed" status if you prefer
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    if (inquiry.email) {
      await sendInquiryRejectedEmail(inquiry.email, inquiry.name, inquiry);
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

export default router;
