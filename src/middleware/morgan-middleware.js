const morgan = require('morgan');
const logger = require('../utils/winston-utils');
const { nodeEnv } = require('../../config');

const stream = {
  write: (message) => logger.http(message.replace(/\n$/, '')),
};
const skip = () => {
  const env = nodeEnv || 'development';
  return env !== 'development';
};

module.exports = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);
