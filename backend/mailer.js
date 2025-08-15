import nodemailer from "nodemailer";
import "dotenv/config";
import { VERIFICATION_EMAIL } from "./verification.js";

// Create Nodemailer transporter using Gmail
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS, 
  },
});

// Function to send verification email
export const sendVerificationEmail = async (toEmail, userName, verificationCode) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Verify Your Email Address",
      html: VERIFICATION_EMAIL(userName, verificationCode),
    });

    console.log(`Verification email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

// Send welcome email
export const sendWelcomeEmail = async (toEmail, userName) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Welcome to AYUBO LANKA",
      html: `
        <p>Hello ${userName},</p>
        <p>Welcome to AYUBO LANKA Ayurvedic Medical Center! Your email has been successfully verified.</p>
        <p>We are excited to have you on board.</p>
        <p>Best regards,<br/>AYUBO LANKA Team</p>
      `,
    });
    console.log(`✅ Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

