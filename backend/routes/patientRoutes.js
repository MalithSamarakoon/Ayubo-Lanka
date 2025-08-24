import express from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

const patientRouter = express.Router();

// Create patient
patientRouter.post("/", createPatient);

// Get all patients
patientRouter.get("/", getPatients);

// Get patient by numeric ID
patientRouter.get("/:id", getPatientById);

// Update patient by numeric ID
patientRouter.put("/:id", updatePatient);

// Delete patient by numeric ID
patientRouter.delete("/:id", deletePatient);

export default patientRouter;
