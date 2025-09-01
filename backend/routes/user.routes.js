import express from "express";
import {
  approveUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  updateDoctorProfile, // New controller to handle doctor profile updates
} from "../controllers/user.controller.js";

// Middleware to verify token and admin role
// userRouter.use(checkAuth); // Uncomment this when implementing checkAuth middleware
// userRouter.use(verifyAdmin); // Uncomment this if you're using verifyAdmin middleware

const userRouter = express.Router();

// Admin routes
userRouter.get("/users", getAllUsers); // Get all users
userRouter.get("/:id", getUserById); // Get user by ID
userRouter.patch("/:id", updateUser); // Update user by ID
userRouter.delete("/:id", deleteUser); // Delete user
userRouter.patch("/approve/:id", approveUser); // Approve a doctor

// Doctor-specific routes
userRouter.patch("/doctor/profile", updateDoctorProfile); // Update doctor profile (experience, consultation fee, description, availability)

export default userRouter;

