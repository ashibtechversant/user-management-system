const createHttpError = require('http-errors');
const transporter = require('../../../nodemailer-utils');
const { emailTimeoutSeconds } = require('../../../../../config');

module.exports = async (email, otp) => {
  await Promise.race([
    transporter.sendMail({
      from: 'User Management System Support <support@ums.com>',
      to: email,
      subject: 'OTP for password reset - User Management System',
      html: `
      <style>
      body {
        font-family: sans-serif;
      }
      h3 {
        color: blue;
      }
      </style>
      <p>Hello <strong>${email}</strong>,</p>
      <p>We have received your request for password reset.
      Your OTP for password reset is: 
      <h3>${otp}</h3>
      This OTP is valid only for the next 5 minutes only. Please do not share it with anyone.
      If you did not request this, please ignore this email.</p>
      <p>Thank you</p>
      <p><strong>Team UMS<strong></p>
    `,
    }),
    new Promise((_, reject) => {
      setTimeout(
        reject,
        emailTimeoutSeconds,
        createHttpError.GatewayTimeout('email sending timed out')
      );
    }),
  ]);
};
