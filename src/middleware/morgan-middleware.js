const morgan = require('morgan');
const logger = require('../helpers/winston-helper');
const { nodeEnv } = require('../../config');

const stream = {
  write: (message) => logger.http(message),
};
const skip = () => {
  const env = nodeEnv || 'development';
  return env !== 'development';
};

module.exports = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);
