
import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, maxlength: 2048 },
    publicId: { type: String },
    mime: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "application/pdf"],
    },
    sizeBytes: { type: Number, required: true, max: 5 * 1024 * 1024 },
    originalName: { type: String, required: true, maxlength: 255 },
    storage: {
      type: String,
      enum: ["local", "cloudinary"],
      default: "local",
      required: true,
    },
  },
  { _id: false }
);

const ReviewSchema = new mongoose.Schema(
  {
    byUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    at: { type: Date, default: Date.now },
    comment: { type: String, maxlength: 1000 },
  },
  { _id: false }
);

const ReceiptSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", 
      required: true,
      index: true,
    },

    bank: { type: String, required: true, maxlength: 80 },
    branch: { type: String, maxlength: 120 },
    paymentDate: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0.01 },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Online transfer", "Cash deposit", "ATM", "CDM"],
    },
    notes: { type: String, maxlength: 2000 },

    file: { type: FileSchema, required: true },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    review: { type: ReviewSchema },
    createdByIp: { type: String, maxlength: 45 },
  },
  { timestamps: true }
);

ReceiptSchema.index({ createdAt: -1 });
ReceiptSchema.index({ status: 1, createdAt: -1 });
ReceiptSchema.index({ bank: 1, createdAt: -1 });

ReceiptSchema.index({ appointmentId: 1, createdAt: -1 }); // NEW
ReceiptSchema.index({ patientId: 1, createdAt: -1 }); // NEW

ReceiptSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.createdByIp;
    return ret;
  },
});

export default mongoose.model("Receipt", ReceiptSchema);
