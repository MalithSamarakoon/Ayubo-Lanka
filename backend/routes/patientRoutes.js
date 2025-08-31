const express = require("express");
const router = express.Router();
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

// Create patient
router.post("/", createPatient);

// Get all patients
router.get("/", getPatients);

// Get patient by numeric ID
router.get("/:id", getPatientById);

// Update patient by numeric ID
router.put("/:id", updatePatient);

// Delete patient by numeric ID
router.delete("/:id", deletePatient);

module.exports = router;
