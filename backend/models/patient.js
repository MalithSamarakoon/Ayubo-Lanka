// backend/models/patient.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    // optional numeric booking id (keep if you already use it)
    id: { type: Number, index: true },

    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    medicalInfo: { type: String, default: "" },

    // ✅ important for Approve button to work
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
