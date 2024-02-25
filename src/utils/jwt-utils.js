const jwt = require('jsonwebtoken');
const { jwtSecretKey, jwtSecretRefreshKey } = require('../../config');

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
  generateOtpToken(otp,email)
};
