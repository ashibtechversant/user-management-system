const express = require('express');
const dotenv = require('dotenv');

// Setup
const app = express();
dotenv.config();
dotenv.config({ path: '.env.local' });
const { port, nodeEnv } = require('../config/index');

// Middlewares
app.use(express.json());

// Entry Route
app
  .route('/')
  .get((_, res) => {
    res.send('Initial Route');
  })
  .all((req, res) =>
    res.status(405).json({
      status: 'error',
      message: `Method ${req.method} is not allowed`,
    })
  );

// Import Routes

// Route Middlewares

// Start the server
app.listen(port, () => {
  console.log(`listening on port ${port} in ${nodeEnv}`);
});
