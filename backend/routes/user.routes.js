import express from "express";
import {
  approveUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  updateDoctorProfile,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.patch("/approve/:id", approveUser);
userRouter.patch("/doctor/profile", updateDoctorProfile);

export default userRouter;
