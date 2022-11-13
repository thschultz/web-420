//Importing Mongoose lib
let mongoose = require("mongoose");


const Schema = mongoose.Schema;

//Creating new schema with fields
const composerSchema = new Schema ({
    firstName: { type: String },
    lastName: { type: String }
    });

//Name the model “Composer” and export it using module.exports
module.exports = mongoose.model('Composer', composerSchema);