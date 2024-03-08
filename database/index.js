const mongoose = require('mongoose');
const logger = require('../src/logger');
const { monogdbUri } = require('../config');

module.exports = async () => {
  try {
    await mongoose.connect(monogdbUri);
    logger.info('Connected to mongodb server');
  } catch (error) {
    logger.error(error);
  }
};
