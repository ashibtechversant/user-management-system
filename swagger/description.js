module.exports = `
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
      \`get /users/me\` 
    - Update admin details:
      \`patch /users/me\`
    - Change admin password:
      \`patch /users/me/password\`
    - Upload admin profile picture:
      \`post /users/me/profile-picture\`
      --> \`patch /users/me\`
  - Login as supervisor:
    - Get all registered users
      \`get /supervisor/users\` 
    - Get a particular user details
      \`get /supervisor/users/{userId}\`
    - Get supervisor details:
      \`get /users/me\` 
    - Update supervisor details:
      \`patch /users/me\`
    - Change supervisor password:
      \`patch /users/me/password\`
    - Upload supervisor profile picture:
      \`post /users/me/profile-picture\`
      --> \`patch /users/me\`
  - Login as agent:
    - Get agent details:
      \`get /users/me\` 
    - Update agent details:
      \`patch /users/me\`
    - Change agent password:
      \`patch /users/me/password\`
    - Upload agent profile picture:
      \`post /users/me/profile-picture\`
      --> \`patch /users/me\`
  
### Access Uploaded Images    
  \`http://localhost:3000/{imagePath}\`

### Search Users (Admin/Supervisor)
  You can search for users with their email, first name or last name by providing the \`search\` query parameter.  
  Eg: \`get /admin/users?search=john\`

### Pagination (Admin/Supervisor)
  You can paginate the results by providing the \`page\` and \`limit\` query parameters.  
  Eg: \`get /admin/users?page=1&limit=10\`  
  - \`limit\` controls the number of results to be returned per page
  - \`page\` controls which page of results is to be shown
`;
