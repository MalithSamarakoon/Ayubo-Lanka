// backend/routes/patients.routes.js
import express from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.get("/", getPatients);
router.get("/:id", getPatientById);
router.post("/", createPatient);

// ✅ required for Approve action
router.patch("/:id", updatePatient);

router.delete("/:id", deletePatient);

export default router;
