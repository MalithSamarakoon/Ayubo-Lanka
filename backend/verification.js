export const VERIFICATION_EMAIL= (userName, verificationCode) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f6f6f6; color: #333; }
      .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; }
      h2 { color: #4CAF50; }
      p { font-size: 16px; }
      .code { font-size: 24px; font-weight: bold; color: #4CAF50; margin: 20px 0; }
      .footer { font-size: 12px; color: #777; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello ${userName},</h2>
      <p>Thank you for registering with AYUBO LANKA Ayurvedic Medical Center.</p>
      <p>Please use the verification code below to verify your email address:</p>
      <div class="code">${verificationCode}</div>
      <p>If you did not register, please ignore this email.</p>
      <div class="footer">
        &copy; 2025 AYUBO LANKA. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;
