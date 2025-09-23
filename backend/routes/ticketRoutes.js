// backend/routes/ticketRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Ticket from "../models/Ticket.js";
import sendMail from "../utils/sendMail.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// /uploads/tickets
const uploadRoot = path.join(__dirname, "..", "uploads", "tickets");
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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const okExt = /\.(jpe?g|png|pdf|docx?)$/i.test(file.originalname || "");
    const okMime = /(image\/jpeg|image\/png|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)/i
      .test(file.mimetype || "");
    return okExt && okMime ? cb(null, true) : cb(new Error("Only document and image files are allowed"));
  },
});

const unlinkSafe = async (abs) => { try { await fs.promises.unlink(abs); } catch {} };
const parseKeep = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  try {
    const arr = JSON.parse(val);
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return String(val).split(",").map(s => s.trim()).filter(Boolean);
  }
};

// ---------- Create ----------
router.post("/", upload.array("attachments", 5), async (req, res) => {
  try {
    const { name, email, department, subject, description } = req.body;
    const ticketNumber = Ticket.generateTicketNumber();

    const attachments = (req.files || []).map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/tickets/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype,
      uploadedAt: new Date(),
    }));

    const ticket = await Ticket.create({
      ticketNumber, name, email,
      // priority is removed in your form; keep default in model
      department, subject, description, attachments,
    });

    await sendMail({
      to: email,
      subject: `Ticket received: ${ticketNumber}`,
      html: `<p>Dear ${name || "Customer"},</p>
             <p>We received your ticket <b>${ticketNumber}</b>.</p>
             <p><b>Subject:</b> ${subject}<br /><b>Status:</b> ${ticket.status}</p>`,
    });

    res.status(201).json({ message: "Ticket created successfully", ticket, ticketNumber: ticket.ticketNumber });
  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- Read by document ID (for review page) ----------
router.get("/by-id/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- Update (text + attachments) ----------
router.put("/:id", upload.array("attachments", 5), async (req, res) => {
  try {
    const doc = await Ticket.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Ticket not found" });

    const keepNames = parseKeep(req.body.keep);
    const kept = (doc.attachments || []).filter((f) => keepNames.includes(f.filename));
    const newFiles = (req.files || []).map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/tickets/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype,
      uploadedAt: new Date(),
    }));

    if (kept.length + newFiles.length > 5) {
      return res.status(400).json({ message: "Maximum 5 total attachments allowed" });
    }

    // remove dropped files from disk
    const removed = (doc.attachments || []).filter((f) => !keepNames.includes(f.filename));
    await Promise.all(removed.map((f) => unlinkSafe(path.join(uploadRoot, f.filename))));

    // update fields
    const fields = ["name", "email", "department", "subject", "description", "status"];
    fields.forEach((k) => { if (k in req.body) doc[k] = req.body[k]; });

    doc.attachments = [...kept, ...newFiles];
    await doc.save();

    res.json({ message: "Ticket updated successfully", ticket: doc });
  } catch (err) {
    console.error("Update ticket error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- Stats / List / Read by ticketNumber / Status ----------
router.get("/stats/overview", async (_req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "open" });
    const inProgressTickets = await Ticket.countDocuments({ status: "in-progress" });
    const resolvedTickets = await Ticket.countDocuments({ status: "resolved" });
    res.json({ totalTickets, openTickets, inProgressTickets, resolvedTickets });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/:ticketNumber", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketNumber: req.params.ticketNumber });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === "resolved") update.resolvedAt = Date.now();
    if (status === "closed") update.closedAt = Date.now();

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Status updated successfully", ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- Delete (by document ID) ----------
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Ticket.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Ticket not found" });
    await Promise.all((doc.attachments || []).map((f) => unlinkSafe(path.join(uploadRoot, f.filename))));
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- Multer error handler ----------
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError || /Only document and image files/.test(err.message || "")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});
// Delete a ticket
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
