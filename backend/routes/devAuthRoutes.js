// backend/routes/devAuthRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// POST /api/auth/dev-login
router.post("/dev-login", (req, res) => {
  const { userId = "u_123", email = "test@example.com" } = req.body || {};

  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax", // works on localhost across ports
    secure: false,   // set true only behind HTTPS
    maxAge: 60 * 60 * 1000,
  });

  return res.json({ success: true, message: "Logged in (cookie set)" });
});

// POST /api/auth/dev-logout
router.post("/dev-logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });
  return res.json({ success: true, message: "Logged out" });
});

// GET /api/auth/whoami (protected)
router.get("/whoami", verifyToken, (req, res) => {
  return res.json({ success: true, userId: req.userId });
});

export default router;
