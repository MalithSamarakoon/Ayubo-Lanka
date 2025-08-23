// backend/routes/ticketRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Ticket = require('../models/Ticket');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/tickets/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only document and image files are allowed'));
    }
  }
});

// Create a new ticket
router.post('/', upload.array('attachments', 5), async (req, res) => {
  try {
    const { name, email, priority, department, subject, description } = req.body;
    
    // Generate ticket number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const ticketNumber = `TKT-${timestamp}-${random}`;
    
    // Process uploaded files
    const attachments = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size
    })) : [];
    
    const newTicket = new Ticket({
      ticketNumber,
      name,
      email,
      priority,
      department,
      subject,
      description,
      attachments
    });
    
    await newTicket.save();
    
    res.status(201).json({
      message: 'Ticket created successfully',
      ticket: newTicket,
      ticketNumber: newTicket.ticketNumber
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get ticket by number (for customers to check status)
router.get('/:ticketNumber', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ 
      ticketNumber: req.params.ticketNumber 
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tickets (for testing - remove auth requirement)
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update ticket status (for testing - remove auth requirement)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { status };
    
    if (status === 'resolved') {
      updateData.resolvedAt = Date.now();
    } else if (status === 'closed') {
      updateData.closedAt = Date.now();
    }
    
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json({ message: 'Status updated successfully', ticket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get ticket statistics (for testing - remove auth requirement)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    
    res.json({
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets
    });
  } catch (error) {
    console.error('Error fetching ticket statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;