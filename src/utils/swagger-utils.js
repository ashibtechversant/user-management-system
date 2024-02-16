const swaggerJsdoc = require('swagger-jsdoc');

// Swagger configuration options
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'UMS API Documentation',
      version: '1.0.0',
      description: 'API documentation for Sample project - UMS',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide your JWT token received after logging in.',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'UMS API Development server',
      },
    ],
  },
  apis: ['src/documentation/**/*.yaml'], // Path to your API routes
};

// Generate Swagger specification
module.exports = swaggerJsdoc(options);
