// backend/models/Support.js
const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  inquiryType: {
    type: String,
    required: true,
    enum: ['product', 'treatment', 'appointment', 'complaint', 'other']
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  files: [
    {
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  status: {
    type: String,
    default: 'new',
    enum: ['new', 'in-progress', 'resolved']
  },
  responded: {
    type: Boolean,
    default: false
  },
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  }
}, {
  timestamps: true // ✅ handles createdAt & updatedAt automatically
});

module.exports = mongoose.model('Support', supportSchema);
