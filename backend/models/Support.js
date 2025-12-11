// backend/models/Support.js
import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SupportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "" },
    inquiryType: {
      type: String,
      required: true,
      enum: ["product", "treatment", "appointment", "complaint", "other"],
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    files: [FileSchema],
    status: {
      type: String,
      default: "new",
      enum: ["new", "in-progress", "resolved"],
      index: true,
    },
    isApproved: { type: Boolean, default: false },
    responded: { type: Boolean, default: false },
    response: {
      message: String,
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      respondedAt: Date,
    },
  },
  { timestamps: true }
);

SupportSchema.index({ createdAt: -1 });

export default mongoose.models.Support ||
  mongoose.model("Support", SupportSchema);
