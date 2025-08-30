import express from "express";
import {
  approveUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Middleware to verify token and admin role
// userRouter.use(checkAuth);
// userRouter.use(verifyAdmin);

// Admin routes
userRouter.get("/users", getAllUsers); // Get all users
userRouter.get("/:id", getUserById);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.patch("/approve/:id", approveUser); // Approve a doctor

export default userRouter;
