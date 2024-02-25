const createHttpError = require('http-errors');
const transporter = require('../../../nodemailer-utils');

const emailTimeout = 20000;

module.exports = async (email, otp) => {
  await Promise.race([
    transporter.sendMail({
      from: 'User Management System Support <support@ums.com>',
      to: email,
      subject: 'OTP for password reset - User Management System',
      text: `Hello ${email},\n
We have received your request for password reset. Your OTP for password reset is: ${otp}. This OTP is valid only for the next 15 minutes only. Please do not share it with anyone. If you did not request this, please ignore this email.\n
Thank you
Team UMS`,
    }),
    new Promise((_, reject) => {
      setTimeout(
        reject,
        emailTimeout,
        createHttpError.GatewayTimeout('email sending timed out')
      );
    }),
  ]);
};
