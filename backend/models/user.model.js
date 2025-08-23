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
  unique: true
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

    // user role (ADMIN, USER, SUPPLIER, DOCTOR)
    role: { 
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
