// backend/utils/sendMail.js (ESM)
import nodemailer from 'nodemailer';

const hasSmtp =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

export default async function sendMail({ to, subject, html, text, from }) {
  try {
    let transporter;

    if (hasSmtp) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true', // true for 465
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Dev fallback: Ethereal test inbox (no real email sent)
      if (String(process.env.MAIL_DISABLE).toLowerCase() === 'true') {
        console.log('[mail] disabled: would send →', { to, subject });
        return { messageId: 'disabled', previewUrl: null };
      }
      const test = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: test.user, pass: test.pass },
      });
    }

    const info = await transporter.sendMail({
      from: from || process.env.SMTP_FROM || '"Arogya Support" <no-reply@arogya.local>',
      to,
      subject,
      text,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;
    if (previewUrl) console.log('Ethereal preview:', previewUrl);

    return { messageId: info.messageId, previewUrl };
  } catch (err) {
    console.error('sendMail error:', err.message);
    // Don’t break the request flow if email fails
    return { messageId: null, previewUrl: null, error: err.message };
  }
}
