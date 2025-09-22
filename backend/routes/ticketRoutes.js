// backend/routes/ticketRoutes.js (ESM)
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

// Ensure upload root exists (…/uploads/tickets)
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    // allow .jpg .jpeg .png .pdf .doc .docx
    const extOk = /\.(jpe?g|png|pdf|docx?)$/i.test(file.originalname || "");
    const mimeOk = /(image\/jpeg|image\/png|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)/i
      .test(file.mimetype || "");
    return extOk && mimeOk
      ? cb(null, true)
      : cb(new Error("Only document and image files are allowed"));
  },
});

// Create a new ticket
router.post("/", upload.array("attachments", 5), async (req, res) => {
  // Debug
  console.log("---- POST /api/tickets ----");
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
    const { name, email, priority, department, subject, description } = req.body;
    const ticketNumber = Ticket.generateTicketNumber();

    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/tickets/${file.filename}`, // public path (served by server.js)
      size: file.size,
      mimetype: file.mimetype,
    }));

    const ticket = await Ticket.create({
      ticketNumber,
      name,
      email,
      priority,
      department,
      subject,
      description,
      attachments,
    });

    // Optional notify email
    try {
      await sendMail({
        to: email,
        subject: `Ticket received: ${ticketNumber}`,
        html: `<p>Dear ${name || "Customer"},</p>
               <p>We received your ticket <b>${ticketNumber}</b>.</p>
               <p><b>Subject:</b> ${subject}<br /><b>Status:</b> ${ticket.status}</p>`,
      });
    } catch (mailErr) {
      console.warn("sendMail failed (continuing):", mailErr?.message);
    }

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
      ticketNumber: ticket.ticketNumber,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Stats
router.get("/stats/overview", async (_req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "open" });
    const inProgressTickets = await Ticket.countDocuments({ status: "in-progress" });
    const resolvedTickets = await Ticket.countDocuments({ status: "resolved" });
    res.json({ totalTickets, openTickets, inProgressTickets, resolvedTickets });
  } catch (error) {
    console.error("Error fetching ticket statistics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:ticketNumber", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketNumber: req.params.ticketNumber });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Multer error handler
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError || /Only document and image files/.test(err.message || "")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

export default router;
