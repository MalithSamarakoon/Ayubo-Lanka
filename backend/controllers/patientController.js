// backend/controllers/patientController.js
// Exports: createPatient, getPatients, getPatientById, updatePatient, deletePatient, getPatientWithPayments

import { isValidObjectId } from "mongoose";
import Patient from "../models/patient.js";
import Receipt from "../models/Receipt.js";
import { sendAppointmentApprovedEmail } from "../mailer.js"; // <-- make sure this path is correct

// CREATE
export const createPatient = async (req, res) => {
  try {
    const { name, age, phone, email, address, medicalInfo } = req.body;
    if (!name || !age || !phone || !email || !address) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // Generate a unique booking ID (numeric)
    const lastPatient = await Patient.findOne().sort({ id: -1 }).lean();
    const nextId =
      lastPatient && Number.isFinite(lastPatient.id)
        ? Number(lastPatient.id) + 1
        : 1000;

    const patient = await Patient.create({
      id: nextId, // numeric booking ID
      name,
      age,
      phone,
      email,
      address,
      medicalInfo: medicalInfo || "",
      // status should default to "pending" in your model schema
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
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    return res.json(patient);
  } catch (err) {
    console.error("getPatientById error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// UPDATE (detect status change → send approval email)
export const updatePatient = async (req, res) => {
  try {
    const id = req.params.id;

    // Build query by numeric booking id or Mongo _id
    let query = null;
    if (/^\d+$/.test(id)) query = { id: Number(id) };
    else if (isValidObjectId(id)) query = { _id: id };
    else return res.status(400).json({ message: "Invalid id" });

    // 1) Load current patient to compare later
    const before = await Patient.findOne(query);
    if (!before) return res.status(404).json({ message: "Patient not found." });

    // 2) Update the patient with provided fields
    const patient = await Patient.findOneAndUpdate(query, req.body, {
      new: true,
    });
    if (!patient)
      return res.status(404).json({ message: "Patient not found." });

    // 3) Compare status transition
    const beforeStatus = String(before.status || "pending").toLowerCase();
    const afterStatus = String(patient.status || "pending").toLowerCase();

    // Only when changing from NOT-approved to approved
    if (beforeStatus !== "approved" && afterStatus === "approved") {
      const toEmail = patient.email;
      const userName = patient.name || "";
      const bookingId = patient.id; // your numeric booking id

      if (toEmail) {
        // Fire-and-forget (don't block response if email fails)
        sendAppointmentApprovedEmail(toEmail, userName, bookingId);
      }
    }

    return res.json(patient);
  } catch (err) {
    console.error("updatePatient error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// DELETE (with optional cascade to receipts)
export const deletePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const cascade = req.query.cascade === "1" || req.query.cascade === "true";

    let query = null;
    if (/^\d+$/.test(id)) query = { id: Number(id) };
    else if (isValidObjectId(id)) query = { _id: id };
    else return res.status(400).json({ message: "Invalid id" });

    // Find patient first to get the _id for related receipts
    const patient = await Patient.findOne(query);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    if (cascade) {
      // Delete receipts linked by appointmentId (patient._id)
      await Receipt.deleteMany({ appointmentId: patient._id });
      // Also delete receipts linked by patientId as an extra safety
      await Receipt.deleteMany({ patientId: patient._id });
    }

    await Patient.findOneAndDelete(query);

    return res.json({
      message: `Patient deleted${cascade ? " with associated receipts" : ""}.`,
      deletedReceipts: cascade,
    });
  } catch (err) {
    console.error("deletePatient error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// ADMIN: BOOKING + PAYMENTS
export const getPatientWithPayments = async (req, res) => {
  try {
    const id = req.params.id;

    let patient = null;
    if (/^\d+$/.test(id)) patient = await Patient.findOne({ id: Number(id) });
    else if (isValidObjectId(id)) patient = await Patient.findById(id);
    else return res.status(400).json({ message: "Invalid id" });

    if (!patient) {
      return res.status(404).json({ message: "Patient/booking not found." });
    }

    const payments = await Receipt.find({ appointmentId: patient._id })
      .sort({ createdAt: -1 })
      .populate("patientId", "name email mobile role");

    return res.json({ patient, payments });
  } catch (err) {
    console.error("getPatientWithPayments error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
