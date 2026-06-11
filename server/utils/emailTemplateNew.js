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
 * Generate HTML email template for password reset with OTP
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

/**
 * Generate HTML email template for password reset link
 */
export const generatePasswordResetLinkTemplate = (resetLink, userName = "User") => {
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
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .reset-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
        }
        .link-section {
          background-color: #f9f9f9;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
          word-break: break-all;
        }
        .link-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .link-text {
          font-size: 13px;
          color: #667eea;
          font-family: 'Courier New', monospace;
          word-wrap: break-word;
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
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Password Reset Request</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${userName},
          </div>
          
          <p class="instructions">
            We received a request to reset your BikeOnRent password. Click the button below to reset it:
          </p>
          
          <div class="button-container">
            <a href="${resetLink}" class="reset-button">Reset Password</a>
          </div>
          
          <p class="instructions">
            Or copy and paste this link in your browser:
          </p>
          
          <div class="link-section">
            <div class="link-label">Reset Link</div>
            <div class="link-text">${resetLink}</div>
            <div class="validity">⏱️ Link expires in 15 minutes</div>
          </div>
          
          <div class="warning">
            <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your account remains secure.
          </div>
          
          <p class="instructions">
            This password reset link will expire in 15 minutes for your security.
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
