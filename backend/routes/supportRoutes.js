// backend/routes/supportRoutes.js
const express = require('express');
const Support = require('../models/Support');

const router = express.Router();

// ------------------- ROUTES -------------------

// Create a new support inquiry
router.post('/inquiry', async (req, res) => {
  try {
    const { name, email, phone, inquiryType, subject, message } = req.body;

    const newInquiry = new Support({
      name,
      email,
      phone,
      inquiryType,
      subject,
      message,
      files: [] // no file upload in this version
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

// Get all support inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await Support.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching support inquiries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update inquiry status
router.put('/inquiry/:id', async (req, res) => {
  try {
    const inquiry = await Support.findByIdAndUpdate(
      req.params.id,
      req.body,   // update with all fields from body
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry updated successfully', inquiry });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get support statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalInquiries = await Support.countDocuments();
    const newInquiries = await Support.countDocuments({ status: 'new' });
    const inProgressInquiries = await Support.countDocuments({ status: 'in-progress' });
    const resolvedInquiries = await Support.countDocuments({ status: 'resolved' });

    res.json({ totalInquiries, newInquiries, inProgressInquiries, resolvedInquiries });
  } catch (error) {
    console.error('Error fetching support statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Delete an inquiry
router.delete('/inquiry/:id', async (req, res) => {
  try {
    const inquiry = await Support.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
