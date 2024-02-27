const jwt = require('jsonwebtoken');
const {
  jwtSecretKey,
  jwtSecretRefreshKey,
  jwtSecretOtpKey,
} = require('../../config');

module.exports = {
  generateToken(userId) {
    return jwt.sign({ userId }, jwtSecretKey, { expiresIn: '1h' });
  },
  verifyToken(token) {
    return jwt.verify(token, jwtSecretKey);
  },
  generateRefreshToken(userId) {
    return jwt.sign({ userId }, jwtSecretRefreshKey, { expiresIn: '30 days' });
  },
  verifyRefreshToken(token) {
    return jwt.verify(token, jwtSecretRefreshKey);
  },
  generateOtpToken(otp, email) {
    console.log(jwtSecretOtpKey);
    return jwt.sign({ otp, email }, jwtSecretOtpKey, { expiresIn: '15m' });
  },
  verifyOtpToken(token) {
    return jwt.verify(token, jwtSecretOtpKey);
  },
};
