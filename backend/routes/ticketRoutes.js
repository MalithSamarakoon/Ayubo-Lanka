// backend/routes/ticketRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Ticket = require('../models/Ticket');
const sendMail = require('../utils/sendMail');

const router = express.Router();

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join('uploads', 'tickets')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'file-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|pdf|doc|docx/i.test(path.extname(file.originalname)) &&
               /jpeg|jpg|png|pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document/i.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only document and image files are allowed'));
  }
});

// Create a new ticket
router.post('/', upload.array('attachments', 5), async (req, res) => {
  try {
    const { name, email, priority, department, subject, description } = req.body;
    const ticketNumber = Ticket.generateTicketNumber();

    const attachments = (req.files || []).map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size
    }));

    const ticket = await Ticket.create({
      ticketNumber, name, email, priority, department, subject, description, attachments
    });

    // email receipt (optional)
    await sendMail({
      to: email,
      subject: `Ticket received: ${ticketNumber}`,
      html: `<p>Dear ${name || 'Customer'},</p>
             <p>We received your ticket <b>${ticketNumber}</b>.</p>
             <p><b>Subject:</b> ${subject}<br /><b>Status:</b> ${ticket.status}</p>`
    });

    res.status(201).json({ message: 'Ticket created successfully', ticket, ticketNumber: ticket.ticketNumber });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- static routes first
router.get('/stats/overview', async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    res.json({ totalTickets, openTickets, inProgressTickets, resolvedTickets });
  } catch (error) {
    console.error('Error fetching ticket statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Param routes
router.get('/:ticketNumber', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketNumber: req.params.ticketNumber });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'resolved') update.resolvedAt = Date.now();
    if (status === 'closed') update.closedAt = Date.now();

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ message: 'Status updated successfully', ticket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || /Only document and image files/.test(err.message)) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
