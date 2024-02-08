const express = require('express');
const dotenv = require('dotenv');
const apiRouter = require('./routes');

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });
const { port, nodeEnv } = require('../config');
const logger = require('./helpers/winston-helper');
const notFoundMiddleware = require('./middleware/not-found-middleware');
const errorHandlerMiddleware = require('./middleware/error-handler-middleware');
const morganMiddleware = require('./middleware/morgan-middleware');

// Setup
const app = express();

// Middlewares
app.use(morganMiddleware); // Logger for development
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter); // Mount api routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); // Global error handling middleware

// Start the server
app.listen(port, () => {
  logger.info(`Server in ${nodeEnv} running on port ${port}`);
});
