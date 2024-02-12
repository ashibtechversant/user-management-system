module.exports = async (err, _, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: 'false',
    error: {
      name: err.name,
      status: err.status || 500,
      message: err.message,
    },
  });
  next();
};
