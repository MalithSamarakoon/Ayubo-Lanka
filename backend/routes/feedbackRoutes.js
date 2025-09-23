// backend/routes/feedbackRoutes.js
import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

/**
 * CREATE feedback
 * body: { name, email, rating, feedback, consent }
 */
router.post("/", async (req, res) => {
  try {
    const { name = "", email = "", rating, feedback, consent = false } = req.body;

    const doc = await Feedback.create({
      name,
      email,
      rating: Number(rating),
      feedback,
      consent: Boolean(consent),
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: doc,
    });
  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * LIST feedback (optional, useful for admin)
 */
router.get("/", async (_req, res) => {
  try {
    const items = await Feedback.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("List feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * READ by id (used by FeedbackReview page)
 */
router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json({ feedback });
  } catch (error) {
    console.error("Get feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * UPDATE by id
 * body: any subset of { name, email, rating, feedback, consent }
 */
router.put("/:id", async (req, res) => {
  try {
    const allowed = ["name", "email", "rating", "feedback", "consent"];
    const payload = {};
    for (const k of allowed) {
      if (k in req.body) payload[k] = k === "rating" ? Number(req.body[k]) :
                                      k === "consent" ? Boolean(req.body[k]) :
                                      req.body[k];
    }

    const updated = await Feedback.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Feedback not found" });

    res.json({ message: "Feedback updated", feedback: updated });
  } catch (error) {
    console.error("Update feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * DELETE by id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
