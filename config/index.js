module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecretKey: process.env.JWT_SECRET_KEY || 'your-secret-key',
};
