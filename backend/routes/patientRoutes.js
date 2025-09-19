// backend/routes/patientRoutes.js
import express from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientWithPayments, // NEW
} from "../controllers/patientController.js";

const patientRouter = express.Router();

// Create patient
patientRouter.post("/", createPatient);

// List patients
patientRouter.get("/", getPatients);

// NEW: Admin convenience (MUST be before the plain :id route)
patientRouter.get("/:id/with-payments", getPatientWithPayments); // NEW

// Get patient by numeric id (or ObjectId fallback)
patientRouter.get("/:id", getPatientById);

// Update patient
patientRouter.put("/:id", updatePatient);

// Delete patient
patientRouter.delete("/:id", deletePatient);

export default patientRouter;
