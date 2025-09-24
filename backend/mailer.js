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

// ------------------ Appointment Approved Email ------------------
export const sendAppointmentApprovedEmail = async (toEmail, userName, bookingId) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Your Appointment Has Been Approved – AYUBO LANKA",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2>Appointment Approved ✅</h2>
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
    // don't throw, we don't want to fail the API call if email fails
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
// ------------------ Ticket / Inquiry Emails ------------------

const wrap = (inner) => `
  <div style="font-family:Arial, sans-serif; line-height:1.6; color:#1f2937">
    <div style="max-width:640px; margin:0 auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden">
      <div style="background:#10b981; color:white; padding:16px 20px">
        <strong>AYUBO LANKA</strong>
      </div>
      <div style="padding:20px">${inner}</div>
      <div style="background:#f9fafb; padding:14px 20px; font-size:12px; color:#6b7280">
        This is an automated message from AYUBO LANKA Support.
      </div>
    </div>
  </div>
`;

export const sendTicketApprovedEmail = async (toEmail, name, ticket) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `We've received your ticket ${ticket?.ticketNumber || ""}`,
      html: wrap(`
        <h2>Ticket Received ✅</h2>
        <p>Hello ${name || "Customer"},</p>
        <p>We’ve received your ticket and set it <strong>In Progress</strong>. Our team will get back to you shortly.</p>
        <p><strong>Ticket #:</strong> ${ticket?.ticketNumber || "-"}<br/>
           <strong>Subject:</strong> ${ticket?.subject || "-"}<br/>
           <strong>Status:</strong> ${ticket?.status || "-"}</p>
        <p>Thank you for your patience.</p>
      `),
    });
  } catch (err) {
    console.error("Error sending ticket approved email:", err);
  }
};

export const sendTicketRejectedEmail = async (toEmail, name, ticket) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `Update on your ticket ${ticket?.ticketNumber || ""}`,
      html: wrap(`
        <h2>Ticket Update ❌</h2>
        <p>Hello ${name || "Customer"},</p>
        <p>We’re sorry — your ticket was <strong>rejected / closed</strong>.</p>
        <p><strong>Ticket #:</strong> ${ticket?.ticketNumber || "-"}<br/>
           <strong>Subject:</strong> ${ticket?.subject || "-"}</p>
        <p>If you think this is a mistake, please reply to this email with more details.</p>
      `),
    });
  } catch (err) {
    console.error("Error sending ticket rejected email:", err);
  }
};

export const sendInquiryApprovedEmail = async (toEmail, name, inquiry) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "We’ve received your inquiry",
      html: wrap(`
        <h2>Inquiry Received ✅</h2>
        <p>Hello ${name || "Customer"},</p>
        <p>We’ve received your inquiry and are <strong>reviewing it</strong>. We’ll reply shortly.</p>
        <p><strong>Type:</strong> ${inquiry?.inquiryType || "-"}<br/>
           <strong>Subject:</strong> ${inquiry?.subject || "-"}</p>
        <p>Thanks for reaching out to AYUBO LANKA.</p>
      `),
    });
  } catch (err) {
    console.error("Error sending inquiry approved email:", err);
  }
};

export const sendInquiryRejectedEmail = async (toEmail, name, inquiry) => {
  try {
    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Update on your inquiry",
      html: wrap(`
        <h2>Inquiry Update ❌</h2>
        <p>Hello ${name || "Customer"},</p>
        <p>We’re sorry — your inquiry was <strong>rejected / closed</strong>.</p>
        <p><strong>Type:</strong> ${inquiry?.inquiryType || "-"}<br/>
           <strong>Subject:</strong> ${inquiry?.subject || "-"}</p>
        <p>Feel free to submit a new inquiry if needed.</p>
      `),
    });
  } catch (err) {
    console.error("Error sending inquiry rejected email:", err);
  }
};
