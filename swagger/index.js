const swaggerJsdoc = require('swagger-jsdoc');
const description = require('./description');

// Swagger configuration options
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'UMS API Documentation',
      version: '1.0.0',
      description,
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
  apis: ['swagger/documentation/**/*.yaml'], // Path to your API routes
};

// Generate Swagger specification
module.exports = swaggerJsdoc(options);
