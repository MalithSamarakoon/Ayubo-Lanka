import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailer.js";
import { sendPasswordResetEmail } from "../mailer.js";
import { sendPasswordResetSuccessEmail } from "../mailer.js";
import { sendAdminApprovalRequestEmail } from "../mailer.js"; 

export const signup = async (req, res) => {
  const {
    // common fields
    email,
    password,
    confirmPassword,
    name,
    mobile,
    role,
    // doctor fields
    doctorLicenseNumber,
    specialization,
    experience,        // New field
    consultationFee,   // New field
    description,       // New field
    availability,      // New field
    // supplier fields
    companyAddress,
    productCategory,
  } = req.body;

  console.log(req.body);

  try {
    // Check required fields
    if (!email || !password || !confirmPassword || !name || !mobile || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate mobile number
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be exactly 10 digits",
      });
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    // Check role-specific fields
    if (role === "DOCTOR") {
      // If DOCTOR, ensure basic doctor fields are present
      if (!doctorLicenseNumber || !specialization) {
        return res
          .status(400)
          .json({ success: false, message: "DOCTOR license number and specialization are required" });
      }
    }

    if (role === "SUPPLIER") {
      if (!companyAddress || !productCategory) {
        return res
          .status(400)
          .json({ success: false, message: "All supplier fields are required" });
      }
    }

    // Check if user exists by email or mobile (optional, based on your need)
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists with this email" });
    }
    const userWithMobile = await User.findOne({ mobile });
    if (userWithMobile) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists with this mobile number" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Case 1: Normal USER
    if (role === "USER") {
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        mobile,
        role,
        isApproved: true,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      });

      // Send verification email
      await sendVerificationEmail(user.email, user.name, verificationToken);

      const { password: _password, ...userTokenData } = user.toObject();
      generateTokenAndSetCookie(res, userTokenData);

      return res.status(201).json({
        success: true,
        message: "Signup successful. Verification email sent.",
        user: userTokenData,
      });
    }

    // Case 2: DOCTOR / SUPPLIER (needs admin approval)
    if (role === "DOCTOR" || role === "SUPPLIER") {
      // If role is doctor or supplier, validate and save specific fields
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        mobile,
        role,
        doctorLicenseNumber,
        specialization,
        experience,       // Save experience for doctor
        consultationFee,  // Save consultationFee for doctor
        description,      // Save description for doctor
        availability,     // Save availability for doctor
        companyAddress,
        productCategory,
        isApproved: false, // pending approval
      });

      // Send admin approval request email for DOCTOR/SUPPLIER
      await sendAdminApprovalRequestEmail(user.name, user.role);

      return res.status(201).json({
        success: true,
        message:
          "Signup successful. Awaiting admin approval. You will receive an email once approved.",
      });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};



export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res
      .status(400)
      .json({ success: false, message: "Verification code is required" });
  }

  const user = await User.findOne({ verificationToken: code });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid verification code" });
  }

  if (user.verificationTokenExpiresAt < Date.now()) {
    return res
      .status(400)
      .json({ success: false, message: "Verification code has expired" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  await sendWelcomeEmail(user.email, user.name);

  res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Block unapproved users (DOCTOR/SUPPLIER)
    if (
      (user.role === "DOCTOR" || user.role === "SUPPLIER") &&
      !user.isApproved
    ) {
      return res.status(403).json({
        success: false,
        message: "Your account is pending admin approval",
      });
    }

       const { password: _password, ...userTokenData } = user.toObject();
    generateTokenAndSetCookie(res, userTokenData);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1h

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!token || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendPasswordResetSuccessEmail(user.email, user.name || "User");

    res.json({
      success: true,
      message: "Password reset successful. Email confirmation sent.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (
      (user.role === "DOCTOR" || user.role === "SUPPLIER") &&
      !user.isApproved
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Account pending approval" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("CheckAuth Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};



