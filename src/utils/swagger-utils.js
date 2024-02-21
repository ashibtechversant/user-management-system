const swaggerJsdoc = require('swagger-jsdoc');

// Swagger configuration options
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'UMS API Documentation',
      version: '1.0.0',
      description:
        '## API documentation for Sample project - UMS \n ### Overview \n This API provides endpoints for managing users in the UMS (User Management System). \n  ### Authentication \n This API uses JWT (JSON Web Token) for authentication. To access protected endpoints, provide your JWT token received as Bearer Token after logging in. The Admin and User Routes are protected; so login with email and password initially using /api/auth/login in Auth Routes. \n ### Usage \n Please refer to the API documentation for detailed information on each endpoint. Initially only one admin user is set for usage. More users can be added (registered) using /api/admin/users in Admin Routes. (You need to authenticate with a jwt token having admin privilege) \n ### Base API Path',
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
