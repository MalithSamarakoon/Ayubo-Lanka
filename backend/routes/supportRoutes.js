// backend/routes/supportRoutes.js
const express = require('express');
const path = require('path');
const multer = require('multer');
const Support = require('../models/Support');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join('uploads', 'support')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'file-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /png|jpg|jpeg|pdf/i.test(path.extname(file.originalname)) &&
               /png|jpg|jpeg|pdf/i.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only PNG, JPG, JPEG, PDF allowed'));
  }
});

// Create a new support inquiry (accepts multipart/form-data)
router.post('/inquiry', upload.array('files', 5), async (req, res) => {
  try {
    const { name, email, phone, inquiryType, subject, message } = req.body;

    const files = (req.files || []).map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      path: f.path,
      size: f.size
    }));

    const inquiry = await Support.create({
      name, email, phone, inquiryType, subject, message, files
    });

    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
  } catch (error) {
    console.error('Error creating support inquiry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// List
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await Support.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update
router.put('/inquiry/:id', async (req, res) => {
  try {
    const inquiry = await Support.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry updated successfully', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete
router.delete('/inquiry/:id', async (req, res) => {
  try {
    const inquiry = await Support.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Stats
router.get('/stats/overview', async (req, res) => {
  try {
    const [totalInquiries, newInquiries, inProgressInquiries, resolvedInquiries] = await Promise.all([
      Support.countDocuments(),
      Support.countDocuments({ status: 'new' }),
      Support.countDocuments({ status: 'in-progress' }),
      Support.countDocuments({ status: 'resolved' }),
    ]);
    res.json({ totalInquiries, newInquiries, inProgressInquiries, resolvedInquiries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || /Only PNG|JPG|JPEG|PDF/.test(err.message)) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
