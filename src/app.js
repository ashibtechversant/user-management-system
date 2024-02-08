const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const apiRouter = require('./routes');

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });
const { port, nodeEnv } = require('../config');
const notFoundMiddleware = require('./middleware/not-found-middleware');
const errorHandlerMiddleware = require('./middleware/error-handler-middleware');

// Setup
const app = express();

// Middlewares
app.use(morgan('dev')); // Logger for development
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter); // Mount api routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); // Global error handling middleware

// Start the server
app.listen(port, () => {
  console.log(`listening on port ${port} in ${nodeEnv}`);
});
