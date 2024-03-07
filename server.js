const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const apiRouter = require('./src/routes');

const { port, nodeEnv } = require('./config');
const logger = require('./src/utils/winston-utils');
const swaggerSpec = require('./swagger/config');
const notFoundMiddleware = require('./src/middleware/not-found-middleware');
const errorHandlerMiddleware = require('./src/middleware/error-handler-middleware');
const morganMiddleware = require('./src/middleware/morgan-middleware');
// Setup
const app = express();

// Middlewares
app.use(cors());
app.use(morganMiddleware); // Logger for development
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('./uploads'));

app.use('/api', apiRouter); // Mount all api routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); // Global error handling middleware

// Start the server
app.listen(port, () => {
  logger.info(`Server in ${nodeEnv} running on port ${port}`);
});
