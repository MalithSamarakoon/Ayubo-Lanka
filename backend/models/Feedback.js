// backend/models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['product', 'service', 'treatment', 'website', 'general'],
    default: 'general'
  },
  consent: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for rating text
feedbackSchema.virtual('ratingText').get(function() {
  const ratings = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };
  return ratings[this.rating] || 'Unknown';
});

module.exports = mongoose.model('Feedback', feedbackSchema);