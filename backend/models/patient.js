import mongoose from "mongoose";
import sequence from "mongoose-sequence";

const AutoIncrement = sequence(mongoose);

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    medicalInfo: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

patientSchema.plugin(AutoIncrement, { inc_field: "id" });

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
