const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

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

module.exports = mongoose.model("Patient", patientSchema);
