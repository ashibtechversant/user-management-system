const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDescription = `
## API documentation for Sample project - UMS  

### Overview  
  This API provides endpoints for managing users in the UMS (User Management System).  

### Authentication  
  This API uses JWT (JSON Web Token) for authentication.
  To access protected endpoints, provide your JWT token received as Bearer Token after logging in.
  The Admin and User Routes are protected;
  so login with email and password initially using /api/auth/login in Auth Routes.  

### Usage  
  Please refer to the API documentation for detailed information on each endpoint.
  Initially only one admin user is set for usage.
  More users can be added (registered) using \`/api/admin/users\` in Admin Routes.
  (You need to authenticate with a jwt token having admin privilege)   

### Base API Path  
  \`http://localhost:3000/api\`  

### Flow
  - Login:
    \`post /auth/login\`
  - Forgot Password:
    \`post /auth/forgot-password\`
    --> \`post /auth/otp\`
    --> \`post /auth/reset-password\`
  - Register (as agent):
    \`post /agents\`
  - Login as admin:  
    - Register new user (any role):
      \`post /admin/users\`
    - Get all registered users
      \`get /admin/users\` 
    - Get a particular user details
      \`get /admin/users/{userId}\`
    - Update any user
      \`patch /admin/users/{userId}\`
    - Delete any user
      \`delete /admin/users/{userId}\`
    - Get admin details:
      \`get /users/{userId}\` 
    - Update admin details:
      \`patch /users/{userId}\`
    - Change admin password:
      \`patch /users/{userId}/password\`
    - Upload admin profile picture:
      \`post /users/{userId}/profile-picture\`
      --> \`patch /users/{userId}\`
  - Login as agent:
    - Get agent details:
      \`get /users/{userId}\` 
    - Update agent details:
      \`patch /users/{userId}\`
    - Change agent password:
      \`patch /users/{userId}/password\`
    - Upload agent profile picture:
      \`post /users/{userId}/profile-picture\`
      --> \`patch /agents/{userId}\`
`;

// Swagger configuration options
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'UMS API Documentation',
      version: '1.0.0',
      description: swaggerDescription,
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
