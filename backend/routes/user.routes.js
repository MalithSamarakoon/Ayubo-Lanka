import express from "express";
import {
  approveUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  updateDoctorProfile,
<<<<<<< HEAD
=======
  getRoleStats, 
>>>>>>> aec98d3a22f08de5b714e08766dae3575d78d779
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

<<<<<<< HEAD
// Try to import verifyAdmin, but provide a fallback if it doesn't exist
let verifyAdmin;
try {
  const adminModule = await import("../middleware/verifyAdmin.js");
  verifyAdmin = adminModule.verifyAdmin;
} catch (error) {
  console.warn("verifyAdmin middleware not found. Using basic admin check.");
  verifyAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }
    next();
  };
}

const userRouter = express.Router();

// Apply token verification to all routes
userRouter.use(verifyToken);

// Admin routes (protected routes)
userRouter.get("/users", verifyAdmin, getAllUsers);
userRouter.get("/:id", getUserById); // Allow users to view their own profile
userRouter.patch("/:id", updateUser); // Allow users to update their own profile
userRouter.delete("/:id", verifyAdmin, deleteUser); // Only admin can delete
userRouter.patch("/approve/:id", verifyAdmin, approveUser); // Only admin can approve

// Doctor-specific routes
userRouter.patch("/doctor/profile", updateDoctorProfile);

export default userRouter;
=======
const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/role-stats", getRoleStats);
userRouter.get("/:id", getUserById);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.patch("/approve/:id", approveUser);
userRouter.patch("/doctor/profile", updateDoctorProfile);

export default userRouter;
>>>>>>> aec98d3a22f08de5b714e08766dae3575d78d779
