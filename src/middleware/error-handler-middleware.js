const responseFormatter = require('../utils/controllers/response-formatter');
const logger = require('../utils/winston-utils');

module.exports = async (err, _, res, next) => {
  res.status(err.status || 500);
  logger.error(
    `${err.name} status: ${err.status || 500} message: ${err.message}`
  );
  res.json(
    responseFormatter(
      'an error has occured',
      {
        error: {
          name: err.name,
          status: err.status || 500,
          message: err.message,
        },
      },
      'false'
    )
  );
  next();
};
