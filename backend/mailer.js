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

const wrap = (title, inner) => `
  <div style="font-family:Inter, Arial, sans-serif; line-height:1.6; color:#111827; background:#f8fafc; padding:16px">
    <div style="max-width:680px; margin:0 auto; background:#fff; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden">
      <div style="background:#10b981; color:white; padding:16px 20px">
        <div style="font-weight:700; font-size:16px;">AYUBO LANKA</div>
        <div style="opacity:.9; font-size:13px">${title}</div>
      </div>
      <div style="padding:20px">${inner}</div>
      <div style="background:#f9fafb; padding:12px 20px; font-size:12px; color:#6b7280">
        This is an automated message from AYUBO LANKA Support.
      </div>
    </div>
  </div>
`;

// ------------------ Ticket / Inquiry Emails ------------------
export const sendTicketStatusEmail = async (toEmail, name, ticket, status, opts = {}) => {
  try {
    const { attachments = [], links = [] } = opts;
    const pretty =
      status === "approved"
        ? { emoji: "✅", head: "Ticket Received & In Progress" }
        : { emoji: "❌", head: "Ticket Rejected" };

    const filesBlock =
      links.length
        ? `<div style="margin-top:12px">
             <div style="font-weight:600; margin-bottom:6px;">Files</div>
             <ul style="margin:0; padding-left:18px;">
               ${links.map(h => `<li><a href="${h}" style="color:#059669">${h}</a></li>`).join("")}
             </ul>
           </div>`
        : "";

    const html = wrap(pretty.head, `
      <h2 style="margin:0 0 8px 0">${pretty.emoji} ${pretty.head}</h2>
      <p>Hello ${name || "Customer"},</p>
      <p>${
        status === "approved"
          ? "We have received your ticket and our team has started reviewing it."
          : "We’re sorry to inform you that your ticket has been rejected."
      }</p>
      <div style="margin-top:10px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb">
        <p><b>Ticket #</b>: ${ticket.ticketNumber}</p>
        <p><b>Subject</b>: ${ticket.subject || "-"}</p>
        <p><b>Description</b>: ${ticket.description || "-"}</p>
        <p><b>Department</b>: ${ticket.department || "-"}</p>
        <p><b>Status</b>: ${ticket.status}</p>
      </div>
      ${filesBlock}
      <p style="margin-top:16px">Best regards,<br/>AYUBO LANKA Team</p>
    `);

    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `[${ticket.ticketNumber}] ${pretty.head} – AYUBO LANKA`,
      html,
      attachments, // ✅ attach uploaded files (kept to first 5 by router)
    });
  } catch (err) {
    console.error("sendTicketStatusEmail failed:", err.message);
  }
};

export const sendInquiryStatusEmail = async (toEmail, name, inquiry, status, opts = {}) => {
  try {
    const { attachments = [], links = [] } = opts;
    const pretty =
      status === "approved"
        ? { emoji: "✅", head: "Inquiry Received & Under Review" }
        : { emoji: "❌", head: "Inquiry Rejected" };

    const filesBlock =
      links.length
        ? `<div style="margin-top:12px">
             <div style="font-weight:600; margin-bottom:6px;">Files</div>
             <ul style="margin:0; padding-left:18px;">
               ${links.map(h => `<li><a href="${h}" style="color:#059669">${h}</a></li>`).join("")}
             </ul>
           </div>`
        : "";

    const html = wrap(pretty.head, `
      <h2 style="margin:0 0 8px 0">${pretty.emoji} ${pretty.head}</h2>
      <p>Hello ${inquiry.name || name || "Customer"},</p>
      <p>${
        status === "approved"
          ? "We’ve received your inquiry and we’re reviewing it. We’ll reply shortly."
          : "We’re sorry to inform you that your inquiry has been rejected."
      }</p>
      <div style="margin-top:10px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb">
        <p><b>Type</b>: ${inquiry.inquiryType || "-"}</p>
        <p><b>Subject</b>: ${inquiry.subject || "-"}</p>
        <p><b>Message</b>: ${inquiry.message || "-"}</p>
        <p><b>Status</b>: ${inquiry.isApproved ? "Approved" : "Pending/Rejected"}</p>
      </div>
      ${filesBlock}
      <p style="margin-top:16px">Best regards,<br/>AYUBO LANKA Team</p>
    `);

    await transporter.sendMail({
      from: `"AYUBO LANKA" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `${pretty.head} – AYUBO LANKA`,
      html,
      attachments, // ✅ attach uploaded files
    });
  } catch (err) {
    console.error("sendInquiryStatusEmail failed:", err.message);
  }
};