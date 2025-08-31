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
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
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

    // Role: ADMIN, USER, SUPPLIER, DOCTOR
    role: {
      type: String,
      required: true,
    },

    // Doctor-specific fields
    doctorLicenseNumber: { type: String }, 
    specialization: { type: String },

    // Supplier-specific fields
    companyName: { type: String },
    companyAddress: { type: String },
    productCategory: { type: String },

    // Common fields
    isApproved: { type: Boolean, default: false }, // Admin approval
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

