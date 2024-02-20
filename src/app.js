const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const apiRouter = require('./routes');

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

const { port, nodeEnv } = require('../config');
const logger = require('./utils/winston-utils');
const swaggerSpec = require('./utils/swagger-utils');
const notFoundMiddleware = require('./middleware/not-found-middleware');
const errorHandlerMiddleware = require('./middleware/error-handler-middleware');
const morganMiddleware = require('./middleware/morgan-middleware');

// Setup
const app = express();

// Middlewares
app.use(cors());
app.use(morganMiddleware); // Logger for development
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter); // Mount all api routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); // Global error handling middleware

// Start the server
app.listen(port, () => {
  logger.info(`Server in ${nodeEnv} running on port ${port}`);
});
