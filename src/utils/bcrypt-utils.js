const bcrypt = require('bcrypt');

const saltRounds = 12;

module.exports = {
  hashPassword(password) {
    return bcrypt.hash(password, saltRounds);
  },
  checkPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },
};
