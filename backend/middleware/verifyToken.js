// backend/middleware/verifyToken.js
import jwt from "jsonwebtoken";

<<<<<<< Updated upstream
export default function verifyToken(req, res, next) {
  try {
    // Authorization: Bearer <token>
    const auth = req.headers?.authorization;
    let token = null;

    if (auth?.startsWith("Bearer ")) {
      token = auth.split(" ")[1];
    }

    // Fallback: cookie "token"
    if (!token) {
      token = req.cookies?.token || null;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
=======
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "unauthorized - no token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in verifyToken", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
>>>>>>> Stashed changes
