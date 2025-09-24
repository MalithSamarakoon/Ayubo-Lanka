// backend/routes/ticketRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Ticket from "../models/Ticket.js";
import {
  sendTicketApprovedEmail,
  sendTicketRejectedEmail,
} from "../mailer.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads/tickets
const uploadRoot = path.join(__dirname, "..", "uploads", "tickets");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "file-" + unique + path.extname(file.originalname || ""));
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const unlinkSafe = async (abs) => { try { await fs.promises.unlink(abs); } catch {} };
const parseKeep = (v) => {
  if (!v) return [];
  try { const a = JSON.parse(v); return Array.isArray(a) ? a.filter(Boolean) : []; }
  catch { return String(v).split(",").map(s => s.trim()).filter(Boolean); }
};

// CREATE
router.post("/", upload.array("attachments", 5), async (req, res) => {
  try {
    const ticketNumber = Ticket.generateTicketNumber();
    const attachments = (req.files || []).map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/tickets/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype,
      uploadedAt: new Date(),
    }));
    const t = await Ticket.create({ ...req.body, ticketNumber, attachments });
    res.status(201).json({ message: "Ticket created successfully", ticket: t, ticketNumber: t.ticketNumber });
  } catch (e) {
    console.error("Create ticket error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// LIST
router.get("/", async (_req, res) => {
  try {
    const list = await Ticket.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// GET by doc id (review page)
router.get("/by-id/:id", async (req, res) => {
  try {
    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Ticket not found" });
    res.json(t);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// UPDATE (keep[] + new files)
router.put("/:id", upload.array("attachments", 5), async (req, res) => {
  try {
    const current = await Ticket.findById(req.params.id);
    if (!current) return res.status(404).json({ message: "Ticket not found" });

    const keep = parseKeep(req.body.keep);
    const kept = (current.attachments || []).filter((f) => keep.includes(f.filename));

    const added = (req.files || []).map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/tickets/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype,
      uploadedAt: new Date(),
    }));

    // delete removed files from disk
    const removed = (current.attachments || []).filter((f) => !keep.includes(f.filename));
    await Promise.all(removed.map((f) => unlinkSafe(path.join(uploadRoot, f.filename))));

    current.set({
      name: req.body.name,
      email: req.body.email,
      department: req.body.department,
      subject: req.body.subject,
      description: req.body.description,
      attachments: [...kept, ...added],
    });
    await current.save();

    res.json({ message: "Ticket updated successfully", ticket: current });
  } catch (e) {
    console.error("Update ticket error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// APPROVE (send email)
router.patch("/:id/approve", async (req, res) => {
  try {
    const t = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: "in-progress", approved: true },
      { new: true }
    );
    if (!t) return res.status(404).json({ message: "Ticket not found" });

    // email
    if (t.email) {
      await sendTicketApprovedEmail(t.email, t.name, t);
    }

    res.json({ message: "Ticket approved", ticket: t });
  } catch (e) {
    console.error("Approve ticket error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// REJECT (send email)
router.patch("/:id/reject", async (req, res) => {
  try {
    const t = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: "closed", rejected: true },
      { new: true }
    );
    if (!t) return res.status(404).json({ message: "Ticket not found" });

    // email
    if (t.email) {
      await sendTicketRejectedEmail(t.email, t.name, t);
    }

    res.json({ message: "Ticket rejected", ticket: t });
  } catch (e) {
    console.error("Reject ticket error:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// DELETE (hard delete)
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Ticket.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

export default router;
