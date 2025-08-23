// backend/routes/supportRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Support = require('../models/Support');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/support/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
  }
});

// Create a new support inquiry
router.post('/inquiry', upload.array('files', 5), async (req, res) => {
  try {
    const { name, email, phone, inquiryType, subject, message } = req.body;
    
    // Process uploaded files
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size
    })) : [];
    
    const newInquiry = new Support({
      name,
      email,
      phone,
      inquiryType,
      subject,
      message,
      files
    });
    
    await newInquiry.save();
    
    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry: newInquiry
    });
  } catch (error) {
    console.error('Error creating support inquiry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all support inquiries (for testing - remove auth requirement)
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await Support.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching support inquiries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update inquiry status (for testing - remove auth requirement)
router.put('/inquiry/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Support.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    res.json({ message: 'Status updated successfully', inquiry });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get support statistics (for testing - remove auth requirement)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalInquiries = await Support.countDocuments();
    const newInquiries = await Support.countDocuments({ status: 'new' });
    const inProgressInquiries = await Support.countDocuments({ status: 'in-progress' });
    const resolvedInquiries = await Support.countDocuments({ status: 'resolved' });
    
    res.json({
      totalInquiries,
      newInquiries,
      inProgressInquiries,
      resolvedInquiries
    });
  } catch (error) {
    console.error('Error fetching support statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;