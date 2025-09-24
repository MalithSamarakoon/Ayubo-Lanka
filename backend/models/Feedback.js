// backend/models/Feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    feedback: { type: String, required: true },
    consent: { type: Boolean, default: false },
    // keep both flags for backwards compatibility
    isApproved: { type: Boolean, default: false },
    approved: { type: Boolean, default: false }, // legacy
  },
  { timestamps: true }
);

export default mongoose.models.Feedback ||
  mongoose.model("Feedback", feedbackSchema);
