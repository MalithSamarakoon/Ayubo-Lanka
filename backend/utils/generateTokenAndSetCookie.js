import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, user) => {
  const payload = {
    userId: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  // Sign the token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Define cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  };

  res.cookie("token", token, cookieOptions);
};
