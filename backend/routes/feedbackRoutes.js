// backend/routes/feedbackRoutes.js
import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { name = "", email = "", rating, feedback, consent = false } = req.body;
    const doc = await Feedback.create({
      name,
      email,
      rating: Number(rating),
      feedback,
      consent: Boolean(consent),
      isApproved: false,
    });
    res.status(201).json({ message: "Feedback submitted successfully", feedback: doc });
  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// LIST all (admin)
router.get("/", async (_req, res) => {
  try {
    const items = await Feedback.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("List feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// LIST approved (public Support page)
router.get("/approved", async (_req, res) => {
  try {
    const items = await Feedback.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("List approved feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// READ
router.get("/:id", async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });
    res.json({ feedback: fb });
  } catch (error) {
    console.error("Get feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// APPROVE / UNAPPROVE — !! the single correct route !!
router.patch("/:id/approve", async (req, res) => {
  try {
    // accept either { approved: true } or { isApproved: true }
    const next = "approved" in req.body ? !!req.body.approved : !!req.body.isApproved;
    const fb = await Feedback.findByIdAndUpdate(
      req.params.id,
      { isApproved: next },
      { new: true }
    );
    if (!fb) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Approval updated", feedback: fb });
  } catch (error) {
    console.error("Approve feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// UPDATE (optional)
router.put("/:id", async (req, res) => {
  try {
    const allowed = ["name", "email", "rating", "feedback", "consent"];
    const payload = {};
    for (const k of allowed) {
      if (k in req.body) {
        payload[k] = k === "rating" ? Number(req.body[k])
                    : k === "consent" ? !!req.body[k]
                    : req.body[k];
      }
    }
    const updated = await Feedback.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback updated", feedback: updated });
  } catch (error) {
    console.error("Update feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE
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
