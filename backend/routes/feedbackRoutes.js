import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

/* CREATE */
router.post("/", async (req, res) => {
  try {
    const { name = "", email = "", rating, feedback, consent = false } = req.body;
    const doc = await Feedback.create({
      name,
      email,
      rating: Number(rating),
      feedback,
      consent: Boolean(consent),
      isApproved: false, // default
      approved: false,   // legacy default
    });
    res.status(201).json({ message: "Feedback submitted successfully", feedback: doc });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* LIST (admin) */
router.get("/", async (_req, res) => {
  try {
    const items = await Feedback.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* LIST APPROVED (Support page uses this)
   —> returns items where either flag is true */
router.get("/approved", async (_req, res) => {
  try {
    const rows = await Feedback.find({
      $or: [{ isApproved: true }, { approved: true }],
    })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* READ by id */
router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* APPROVE / UNAPPROVE
   Accepts { isApproved } or { approved } and writes both flags */
router.patch("/:id/approve", async (req, res) => {
  try {
    const next =
      typeof req.body.isApproved !== "undefined"
        ? !!req.body.isApproved
        : !!req.body.approved;

    const doc = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $set: { isApproved: next, approved: next } }, // keep in sync
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback approval updated", feedback: doc });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

/* UPDATE text/rating */
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
    const updated = await Feedback.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback updated", feedback: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
