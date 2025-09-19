// backend/controllers/patientController.js
// Exports: createPatient, getPatients, getPatientById, updatePatient, deletePatient, getPatientWithPayments

import { isValidObjectId } from "mongoose";
import Patient from "../models/patient.js";
import Receipt from "../models/Receipt.js"; // used by getPatientWithPayments

// CREATE
export const createPatient = async (req, res) => {
  try {
    const { name, age, phone, email, address, medicalInfo } = req.body;
    if (!name || !age || !phone || !email || !address) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }
    const patient = await Patient.create({
      name,
      age,
      phone,
      email,
      address,
      medicalInfo: medicalInfo || "",
    });
    return res.status(201).json(patient);
  } catch (err) {
    console.error("createPatient error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// LIST
export const getPatients = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Patient.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Patient.countDocuments(),
    ]);
    return res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("getPatients error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// READ (numeric id OR ObjectId)
export const getPatientById = async (req, res) => {
  try {
    const id = req.params.id;
    let patient = null;
    if (/^\d+$/.test(id)) {
      patient = await Patient.findOne({ id: Number(id) });
    }
    if (!patient && isValidObjectId(id)) {
      patient = await Patient.findById(id);
    }
    if (!patient)
      return res.status(404).json({ message: "Patient not found." });
    return res.json(patient);
  } catch (err) {
    console.error("getPatientById error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// UPDATE
export const updatePatient = async (req, res) => {
  try {
    const id = req.params.id;
    let query = null;
    if (/^\d+$/.test(id)) query = { id: Number(id) };
    else if (isValidObjectId(id)) query = { _id: id };
    else return res.status(400).json({ message: "Invalid id" });

    const patient = await Patient.findOneAndUpdate(query, req.body, {
      new: true,
    });
    if (!patient)
      return res.status(404).json({ message: "Patient not found." });
    return res.json(patient);
  } catch (err) {
    console.error("updatePatient error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// DELETE
export const deletePatient = async (req, res) => {
  try {
    const id = req.params.id;
    let query = null;
    if (/^\d+$/.test(id)) query = { id: Number(id) };
    else if (isValidObjectId(id)) query = { _id: id };
    else return res.status(400).json({ message: "Invalid id" });

    const patient = await Patient.findOneAndDelete(query);
    if (!patient)
      return res.status(404).json({ message: "Patient not found." });
    return res.json({ message: "Patient deleted." });
  } catch (err) {
    console.error("deletePatient error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// ADMIN: BOOKING + PAYMENTS (optional single-booking view)
export const getPatientWithPayments = async (req, res) => {
  try {
    const id = req.params.id;
    let patient = null;
    if (/^\d+$/.test(id)) patient = await Patient.findOne({ id: Number(id) });
    else if (isValidObjectId(id)) patient = await Patient.findById(id);
    else return res.status(400).json({ message: "Invalid id" });

    if (!patient)
      return res.status(404).json({ message: "Patient/booking not found." });

    const payments = await Receipt.find({ appointmentId: patient._id })
      .sort({ createdAt: -1 })
      .populate("patientId", "name email mobile role");

    return res.json({ patient, payments });
  } catch (err) {
    console.error("getPatientWithPayments error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
