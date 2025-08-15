const Patient = require("../models/patient");

exports.createPatient = async (req, res) => {
  try {
    const { name, age, phone, email, address, medicalInfo } = req.body;
    // Basic server-side validation
    if (!name || !age || !phone || !email || !address)
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });

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
