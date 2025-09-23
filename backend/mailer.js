import nodemailer from "nodemailer";
import "dotenv/config";
import { VERIFICATION_EMAIL } from "./verification.js";
import { RESET_PASSWORD_EMAIL } from "./resetPassword.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const sendVerificationEmail = async (
  toEmail,
  userName,
  verificationCode
) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Verify Your Email Address",
      html: VERIFICATION_EMAIL(userName, verificationCode),
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

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
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const sendPasswordResetEmail = async (
  toEmail,
  resetURL,
  userName = ""
) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Reset Your Password - AYUBO LANKA",
      html: RESET_PASSWORD_EMAIL(userName, resetURL),
    });

    console.log(`Password reset email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};


export const sendAppointmentApprovedEmail = async (toEmail, userName, bookingId) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Your Appointment Has Been Approved – AYUBO LANKA",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2>Appointment Approved</h2>
          <p>Hello ${userName || "Customer"},</p>
          <p>Your appointment has been <strong>approved</strong>.</p>
          <p><strong>Booking ID:</strong> ${bookingId ? "#" + bookingId : "N/A"}</p>
          <p>We look forward to seeing you.</p>
          <p style="margin-top:16px">
            Best regards,<br/>
            AYUBO LANKA Team
          </p>
        </div>
      `,
    });
    console.log(`Appointment approval email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending appointment approval email:", error);
   
  }
};


export const sendPasswordResetSuccessEmail = async (toEmail, userName) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Your Password Has Been Reset",
      html: `
        <p>Hello ${userName},</p>
        <p>Your password has been successfully updated.</p>
        <p>If you did not perform this action, please contact our support team immediately.</p>
        <p>Best regards,<br/>AYUBO LANKA Team</p>
      `,
    });
    console.log(`Password reset success email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
  }
};

export const sendAdminApprovalRequestEmail = async (userName, userRole) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New ${userRole} Signup Approval Needed`,
      html: `
        <p>Hello Admin,</p>
        <p>A new ${userRole} <strong>${userName}</strong> has signed up and requires your approval.</p>
        <p>Please log in to the admin panel to approve or reject this signup.</p>
        <p>Best regards,<br/>AYUBO LANKA System</p>
      `,
    });
    console.log(
      `Admin approval request email sent to ${process.env.GMAIL_USER}`
    );
  } catch (error) {
    console.error("Error sending admin approval request email:", error);
  }
};

export const sendUserApprovedEmail = async (toEmail, userName) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Your Account Has Been Approved",
      html: `
        <p>Hello ${userName},</p>
        <p>Congratulations! Your account has been approved by the admin.</p>
        <p>You can now log in and start using our services.</p>

        <p>Best regards,<br/>AYUBO LANKA Team</p>
      `,
    });
    console.log(`User approval email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending user approval email:", error);
  }
};
