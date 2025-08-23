// backend/routes/feedbackRoutes.js
const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

// Create new feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, feedback, category, consent } = req.body;
    
    const newFeedback = new Feedback({
      name,
      email,
      rating,
      feedback,
      category,
      consent
    });
    
    await newFeedback.save();
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: newFeedback
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all feedback (for testing - remove auth requirement)
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get average rating and stats
router.get('/stats/overview', async (req, res) => {
  try {
    const result = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalFeedback: { $sum: 1 }
        }
      }
    ]);
    
    const featuredFeedback = await Feedback.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(5);
    
    if (result.length === 0) {
      return res.json({
        averageRating: 0,
        totalFeedback: 0,
        featuredFeedback
      });
    }
    
    res.json({
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalFeedback: result[0].totalFeedback,
      featuredFeedback
    });
  } catch (error) {
    console.error('Error calculating feedback statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;