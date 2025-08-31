export const RESET_PASSWORD_EMAIL = (userName, resetURL) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Reset Your Password</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Hello ${userName || "User"},</p>
      <p>We received a request to reset your password. Click the button below to set a new one:</p>
      <p style="text-align: center; margin: 20px 0;">
        <a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
      </p>
      <p>If you did not request this, you can safely ignore this email. The link will expire in 1 hour.</p>
      <br>
      <p>Best regards,<br/>AYUBO LANKA Team</p>
    </div>
  </body>
  </html>
`;