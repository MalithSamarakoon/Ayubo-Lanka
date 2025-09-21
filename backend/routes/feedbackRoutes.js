import express from "express";
import Feedback from "../models/Feedback.js";
import sendMail from '../utils/sendMail.js';
const router = express.Router();

// Create new feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, rating, feedback, category, consent } = req.body;

    const newFeedback = new Feedback({
      name,
      email,
      rating,
      feedback,
      category,
      consent,
    });

    await newFeedback.save();

    res
      .status(201)
      .json({ message: "Feedback submitted successfully", feedback: newFeedback });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all feedback
router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get feedback stats
router.get("/stats/overview", async (req, res) => {
  try {
    const result = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalFeedback: { $sum: 1 },
        },
      },
    ]);

    const featuredFeedback = await Feedback.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(5);

    if (result.length === 0) {
      return res.json({
        averageRating: 0,
        totalFeedback: 0,
        featuredFeedback,
      });
    }

    res.json({
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalFeedback: result[0].totalFeedback,
      featuredFeedback,
    });
  } catch (error) {
    console.error("Error calculating feedback statistics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update feedback
router.put("/:id", async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({
      message: "Feedback updated successfully",
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete feedback
router.delete("/:id", async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
