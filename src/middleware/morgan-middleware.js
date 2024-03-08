const morgan = require('morgan');
const logger = require('../logger');
const { nodeEnv } = require('../../config');

const stream = {
  write: (message) => logger.http(message.replace(/\n$/, '')),
};
const skip = (req) => {
  const env = nodeEnv || 'development';
  return (
    env !== 'development' ||
    req.url.startsWith('/swagger-ui') ||
    req.url.startsWith('/favicon')
  );
};

module.exports = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);
