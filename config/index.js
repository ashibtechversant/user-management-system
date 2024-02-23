const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecretKey: process.env.JWT_SECRET_KEY || 'your-secret-key',
  jwtSecretRefreshKey:
    process.env.JWT_SECRET_REFRESH_KEY || 'your-secret-refresh-key',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
};
