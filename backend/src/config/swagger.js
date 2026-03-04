const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Speedtar API',
      version: '1.0.0',
      description: 'Speedtar E-commerce API Documentation',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000/api',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = swaggerUi.setup(specs);
