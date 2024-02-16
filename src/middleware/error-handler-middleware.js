const responseFormatter = require('../utils/helpers/controllers/response-formatter');

module.exports = async (err, _, res, next) => {
  res.status(err.status || 500);
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
