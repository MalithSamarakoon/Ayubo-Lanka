import express from "express";
import { approveUser, getAllUsers } from "../controllers/user.controller.js";

const userRouter = express.Router();

// Middleware to verify token and admin role
// userRouter.use(checkAuth);
// userRouter.use(verifyAdmin);

// Admin routes
userRouter.get("/users", getAllUsers); // Get all users
userRouter.post("/approve-user/:id", approveUser); // Approve a doctor

export default userRouter;
