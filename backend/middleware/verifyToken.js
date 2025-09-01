// backend/middleware/verifyToken.js
import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  try {
    // 1) Try "Authorization: Bearer <token>"
    const auth = req.headers?.authorization;
    let token = null;

    if (auth?.startsWith("Bearer ")) {
      token = auth.split(" ")[1];
    }

    // 2) Fallback to httpOnly cookie "token"
    if (!token) {
      token = req.cookies?.token || null;
    }

    // 3) If still missing → stop gracefully (no crash)
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 4) Verify & attach user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
