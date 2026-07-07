const nodemailer = require('nodemailer');

/**
 * Create email transporter
 * @returns {Object} Nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send registration OTP email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Email response
 */
const sendRegistrationOTP = async (email, name, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Hostelite" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - Hostelite Registration',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
          .otp { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Hostelite!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for registering with Hostelite. To complete your registration, please verify your email address using the OTP below:</p>
            <div class="otp">${otp}</div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Hostelite. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Send resend OTP email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Email response
 */
const sendResendOTP = async (email, name, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Hostelite" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'New OTP - Hostelite Registration',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
          .otp { font-size: 32px; font-weight: bold; color: #2196F3; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New OTP Request</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>You requested a new OTP for your Hostelite registration. Here's your new code:</p>
            <div class="otp">${otp}</div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Hostelite. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Send password reset OTP email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Email response
 */
const sendPasswordResetOTP = async (email, name, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Hostelite" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP - Hostelite',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
          .otp { font-size: 32px; font-weight: bold; color: #ff9800; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Use the OTP below to reset your password:</p>
            <div class="otp">${otp}</div>
            <p>This OTP will expire in 15 minutes.</p>
            <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Hostelite. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendRegistrationOTP,
  sendResendOTP,
  sendPasswordResetOTP,
};
