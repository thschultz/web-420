// WEB 420 RESTful API
// Contributors

// Richard Krasso
// Thomas James Schultz

// Require statement
const mongoose = require('mongoose');

// Creates Mongoose schema
const schema = mongoose.schema;

// Creates new Users under the schema
let userSchema = new mongoose.Schema({
    userName: {type: String},
    password: {type: String},
    emailAddress: {type: Array},
});

// Exports the schema
module.exports = mongoose.model('User', userSchema);
