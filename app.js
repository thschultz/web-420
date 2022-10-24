const express = require('express');
const http = require('http');
const swaggerUI = require('swagger-ui-express');
const swaggerJS = require('swagger-jsdoc');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
.use(express.urlencoded({'extended': true}));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WEB 420 RESTful APIs',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};

const openapiSpecification = swaggerJS(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));

http.createServer(app)
.listen(PORT, (e) => {
  console.log(`Application started and listening on ${PORT}`);
});