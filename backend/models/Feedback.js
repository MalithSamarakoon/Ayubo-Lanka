// backend/models/Feedback.js
import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    feedback: { type: String, required: true, trim: true },
    consent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
