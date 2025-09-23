// backend/routes/ticketRoutes.js (ESM)
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Ticket from "../models/Ticket.js";

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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    // fixed: removed trailing "|" that allowed empty extension
    const extOk = /\.(jpe?g|png|pdf|docx?)$/i.test(file.originalname || "");
    const mimeOk = /(image\/jpeg|image\/png|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument\.wordprocessingml\.document)/i
      .test(file.mimetype || "");
    return extOk && mimeOk
      ? cb(null, true)
      : cb(new Error("Only document and image files are allowed"));
  },
});

// CREATE
router.post("/", upload.array("attachments", 5), async (req, res) => {
  try {
    const { name, email, department, subject, description } = req.body;
    const ticketNumber = Ticket.generateTicketNumber();

    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/tickets/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    const ticket = await Ticket.create({
      ticketNumber,
      name,
      email,
      department,
      subject,
      description,
      attachments,
    });

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

// LIST
router.get("/", async (_req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// READ by ticketNumber (kept for compatibility)
router.get("/:ticketNumber", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      ticketNumber: req.params.ticketNumber,
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔹 READ by Mongo _id (NEW, used by review page)
router.get("/by-id/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket by id:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔹 UPDATE core fields by _id (NEW)
router.put("/:id", async (req, res) => {
  try {
    const allowed = ["name", "email", "department", "subject", "description", "status"];
    const payload = {};
    for (const k of allowed) if (k in req.body) payload[k] = req.body[k];

    if (payload.status === "resolved") payload.resolvedAt = Date.now();
    if (payload.status === "closed") payload.closedAt = Date.now();

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket updated", ticket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔹 DELETE by _id (NEW)
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Multer error handler
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
