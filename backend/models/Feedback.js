// backend/models/Feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    feedback: { type: String, required: true },
    consent: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false }, // ← NEW
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
