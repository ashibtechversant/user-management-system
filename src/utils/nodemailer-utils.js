const nodemailer = require('nodemailer');
const {
  smtpHost,
  smtpPort,
  smtpUsername,
  smtpPassword,
} = require('../../config');

const smtpOptions = {
  host: smtpHost,
  port: smtpPort,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
};
module.exports = nodemailer.createTransport(smtpOptions);
