import { sendUserApprovedEmail } from "../mailer.js";
import { User } from "../models/user.model.js";

// Approve user (remains the same)
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    ).exec();

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Approved User:", user);

    await sendUserApprovedEmail(user.email, user.name || "User");
    res.json({ message: "User approved and notified", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users (remains the same)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ message: "User retrieved successfully", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all doctors (remains the same)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "DOCTOR" }).sort({ createdAt: -1 });
    res.json({ message: "Doctors retrieved successfully", doctors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID (remains the same)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user by ID (modified to handle new doctor fields)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, mobile } = req.body;

    // Ensure only doctors can update doctor-specific fields
    if (role === "DOCTOR") {
      console.log(req.body);
      const updateDoctorProfile = {
        ...req.body,
      };

      // Update general and doctor-specific fields
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateDoctorProfile,
        { new: true }
      );

      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ user: updatedUser });
    }

    // For non-doctors, only update non-doctor fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, mobile },
      { new: true } // return updated document
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user (remains the same)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// New controller to update only doctor profile fields
export const updateDoctorProfile = async (req, res) => {
  try {
    const { experience, consultationFee, description, availability } = req.body;

    // Validate that only doctors can update these fields
    if (req.user.role !== "DOCTOR") {
      return res
        .status(403)
        .json({ message: "Only doctors can update this profile" });
    }

    const updatedDoctorProfile = await User.findByIdAndUpdate(
      req.user.id,
      { experience, consultationFee, description, availability },
      { new: true, runValidators: true } // return updated document with validation
    );

    if (!updatedDoctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.status(200).json({ user: updatedDoctorProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
