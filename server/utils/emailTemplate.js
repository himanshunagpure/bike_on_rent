/**
 * Generate HTML email template for OTP verification
 */
export const generateOTPEmailTemplate = (otp, userName = "User") => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 16px;
          color: #333;
          margin-bottom: 20px;
        }
        .otp-section {
          background-color: #f9f9f9;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        .otp-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .otp-code {
          font-size: 32px;
          font-weight: 700;
          color: #667eea;
          letter-spacing: 4px;
          text-align: center;
          font-family: 'Courier New', monospace;
        }
        .validity {
          font-size: 13px;
          color: #e74c3c;
          margin-top: 15px;
          text-align: center;
          font-weight: 600;
        }
        .instructions {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin: 25px 0;
        }
        .button {
          display: inline-block;
          background-color: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px 30px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #999;
          text-align: center;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          font-size: 13px;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🚴 BikeOnRent</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Email Verification</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${userName},
          </div>
          
          <p class="instructions">
            Thank you for signing up with BikeOnRent! To complete your registration and verify your email address, please use the following One-Time Password (OTP):
          </p>
          
          <div class="otp-section">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="validity">⏱️ Valid for 10 minutes only</div>
          </div>
          
          <p class="instructions">
            Enter this code in the verification field on our platform to confirm your email address.
          </p>
          
          <div class="warning">
            <strong>Security Notice:</strong> Never share this OTP with anyone. BikeOnRent support will never ask for your OTP via email or phone.
          </div>
          
          <p class="instructions">
            If you didn't sign up for BikeOnRent, please ignore this email or contact our support team.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 8px 0;">
            © 2024 BikeOnRent. All rights reserved.
          </p>
          <p style="margin: 0;">
            Questions? Contact us at support@wheelsonrent.online
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate HTML email template for password reset
 */
export const generateResetPasswordEmailTemplate = (otp, userName = "User") => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 16px;
          color: #333;
          margin-bottom: 20px;
        }
        .otp-section {
          background-color: #f9f9f9;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        .otp-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .otp-code {
          font-size: 32px;
          font-weight: 700;
          color: #667eea;
          letter-spacing: 4px;
          text-align: center;
          font-family: 'Courier New', monospace;
        }
        .validity {
          font-size: 13px;
          color: #e74c3c;
          margin-top: 15px;
          text-align: center;
          font-weight: 600;
        }
        .instructions {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin: 25px 0;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px 30px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #999;
          text-align: center;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          font-size: 13px;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🚴 BikeOnRent</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Password Reset</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${userName},
          </div>
          
          <p class="instructions">
            We received a request to reset your password. Use the OTP below to set a new password for your BikeOnRent account.
          </p>
          
          <div class="otp-section">
            <div class="otp-label">Password Reset Code</div>
            <div class="otp-code">${otp}</div>
            <div class="validity">⏱️ Valid for 10 minutes only</div>
          </div>
          
          <p class="instructions">
            Enter this code to create a new password for your account.
          </p>
          
          <div class="warning">
            <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your account remains secure.
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 8px 0;">
            © 2024 BikeOnRent. All rights reserved.
          </p>
          <p style="margin: 0;">
            Questions? Contact us at support@wheelsonrent.online
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
