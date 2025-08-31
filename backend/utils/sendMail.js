// backend/utils/sendMail.js
const nodemailer = require('nodemailer');

let transporter;
function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.gmail.com',
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  return transporter;
}

module.exports = async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.log('[mail] SMTP not configured; skipping email ->', to, subject);
    return { skipped: true };
  }
  const from = process.env.MAIL_FROM || '"Ayurvedic Support" <no-reply@local.test>';
  return t.sendMail({ from, to, subject, html });
};
