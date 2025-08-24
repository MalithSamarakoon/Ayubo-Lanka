import Patient from "../models/patient.js";

// Create patient
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
      medicalInfo,
    });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get patient by numeric ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ id: req.params.id });
    if (!patient)
      return res.status(404).json({ message: "Patient not found." });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update patient by numeric ID
export const updatePatient = async (req, res) => {
  try {
    const { name, age, phone, email, address, medicalInfo } = req.body;
    const patient = await Patient.findOneAndUpdate(
      { id: req.params.id },
      { name, age, phone, email, address, medicalInfo },
      { new: true, runValidators: true }
    );
    if (!patient)
      return res.status(404).json({ message: "Patient not found." });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete patient by numeric ID
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({ id: req.params.id });
    if (!patient)
      return res.status(404).json({ message: "Patient not found." });
    res.json({ message: "Patient deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
