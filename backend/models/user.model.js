import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      // match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },

    role: {
      type: String,
      required: true,
    },

    doctorLicenseNumber: { type: String },
    specialization: { type: String },
    experience: { type: Number, min: 0, default: 0 },
    consultationFee: { type: Number, min: 0, default: 0 },
    description: { type: String, default: "" },
    availability: {
      type: String,
      enum: ["weekday", "weekend", "not_available"],
      default: "not_available",
    },

    companyName: { type: String },
    companyAddress: { type: String },
    productCategory: { type: String },

    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
