const express = require('express');
const http = require('http');
const swaggerUI = require('swagger-ui-express');
const swaggerJS = require('swagger-jsdoc');
const mongoose = require('mongoose');
const composerAPI = require('./routes/schultz-composer-routes.js');
const personAPI = require('./routes/schultz-person-routes');
const userAPI = require('./routes/schultz-session-routes.js');
const customerAPI = require('./routes/schultz-node-shopper-routes.js');
const teamAPI = require('./routes/schultz-teams-routes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Link to mongoDB. 
var mongoDB = "mongodb+srv://tschultz420:s3cret@web420db.wmtlkqd.mongodb.net/web420DB";

// Mongoose connection. 
mongoose.connect(mongoDB, {
});

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error: "));

db.once("open", function() {
    console.log("Application connected to MongoDB instance");
});

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
app.use('/api', composerAPI);
app.use('/api', personAPI);
app.use('/api', userAPI);
app.use('/api', customerAPI);
app.use('/api', teamAPI);

http.createServer(app)
.listen(PORT, (e) => {
  console.log(`Application started and listening on ${PORT}`);
});