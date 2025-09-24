// backend/routes/ticketRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Ticket from "../models/Ticket.js";
// import sendMail from "../utils/sendMail.js"; // optional

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure /uploads/tickets exists
const uploadRoot = path.join(__dirname, "..", "uploads", "tickets");
fs.mkdirSync(uploadRoot, { recursive: true });

// ----- Multer setup -----
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "file-" + unique + path.extname(file.originalname || ""));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const okExt = /\.(jpe?g|png|pdf|docx?)$/i.test(file.originalname || "");
    const okMime = /(image\/jpeg|image\/png|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)/i
      .test(file.mimetype || "");
    return okExt && okMime
      ? cb(null, true)
      : cb(new Error("Only document and image files are allowed"));
  },
});

// helpers
const unlinkSafe = async (absPath) => {
  try {
    await fs.promises.unlink(absPath);
  } catch {
    /* ignore */
  }
};

const parseKeep = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  try {
    const arr = JSON.parse(val);
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return String(val)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
};

// ========== CREATE ==========
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
      ticketNumber,
      name,
      email,
      // priority removed from form; let schema default it if present
      department,
      subject,
      description,
      attachments,
      // status defaults in schema (e.g., "open")
    });

    // Optional email
    // await sendMail({
    //   to: email,
    //   subject: `Ticket received: ${ticketNumber}`,
    //   html: `<p>Dear ${name || "Customer"},</p>
    //          <p>We received your ticket <b>${ticketNumber}</b>.</p>
    //          <p><b>Subject:</b> ${subject}<br /><b>Status:</b> ${ticket.status}</p>`,
    // });

    res
      .status(201)
      .json({ message: "Ticket created successfully", ticket, ticketNumber: ticket.ticketNumber });
  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== LIST ==========
router.get("/", async (_req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== READ BY DOCUMENT ID (for review page) ==========
router.get("/by-id/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== STATS ==========
router.get("/stats/overview", async (_req, res) => {
  try {
    const [totalTickets, openTickets, inProgressTickets, resolvedTickets] =
      await Promise.all([
        Ticket.countDocuments(),
        Ticket.countDocuments({ status: "open" }),
        Ticket.countDocuments({ status: "in-progress" }),
        Ticket.countDocuments({ status: "resolved" }),
      ]);
    res.json({ totalTickets, openTickets, inProgressTickets, resolvedTickets });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== UPDATE (text + attachments) ==========
router.put("/:id", upload.array("attachments", 5), async (req, res) => {
  try {
    const doc = await Ticket.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Ticket not found" });

    const keepNames = parseKeep(req.body.keep); // array of filenames to keep
    const kept = (doc.attachments || []).filter((f) =>
      keepNames.includes(f.filename)
    );

    const newFiles = (req.files || []).map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/tickets/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype,
      uploadedAt: new Date(),
    }));

    if (kept.length + newFiles.length > 5) {
      return res
        .status(400)
        .json({ message: "Maximum 5 total attachments allowed" });
    }

    // remove dropped files from disk
    const removed = (doc.attachments || []).filter(
      (f) => !keepNames.includes(f.filename)
    );
    await Promise.all(
      removed.map((f) => unlinkSafe(path.join(uploadRoot, f.filename)))
    );

    // update scalar fields (only set if provided)
    const fields = [
      "name",
      "email",
      "department",
      "subject",
      "description",
      "status",
    ];
    fields.forEach((k) => {
      if (k in req.body) doc[k] = req.body[k];
    });

    // update attachments
    doc.attachments = [...kept, ...newFiles];
    await doc.save();

    res.json({ message: "Ticket updated successfully", ticket: doc });
  } catch (err) {
    console.error("Update ticket error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== STATUS ==========
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === "resolved") update.resolvedAt = Date.now();
    if (status === "closed") update.closedAt = Date.now();

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Status updated successfully", ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== APPROVE (toggle) ==========
router.patch("/:id/approve", async (req, res) => {
  try {
    const approved =
      typeof req.body.approved !== "undefined"
        ? !!req.body.approved
        : !!req.body.isApproved;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { approved, ...(approved ? { status: "in-progress" } : {}) },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket approval updated", ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== REJECT (close instead of delete) ==========
router.patch("/:id/reject", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: "closed", rejected: true, closedAt: Date.now() },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket rejected (closed)", ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== HARD DELETE (by document id) ==========
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Ticket.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Ticket not found" });

    // clean up files
    await Promise.all(
      (doc.attachments || []).map((f) =>
        unlinkSafe(path.join(uploadRoot, f.filename))
      )
    );

    res.json({ message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== READ BY ticketNumber (keep last so it doesn't catch other routes) ==========
router.get("/:ticketNumber", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      ticketNumber: req.params.ticketNumber,
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----- Multer/validation error handler -----
router.use((err, _req, res, next) => {
  if (
    err instanceof multer.MulterError ||
    /Only document and image files/.test(err.message || "")
  ) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

export default router;
