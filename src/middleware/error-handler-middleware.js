module.exports = async (err, _, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: 'error',
    error: {
      name: err.name,
      status: err.status || 500,
      message: err.message,
    },
  });
  next();
};
