const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../../config/index');

module.exports = {
  generateToken(user) {
    return jwt.sign({ id: user.id }, jwtSecretKey);
  },
  verifyToken(token) {
    return jwt.verify(token, jwtSecretKey);
  },
};
