// Require statement
const mongoose = require('mongoose');

// Creates Mongoose schema
const Schema = mongoose.Schema;

// Create playerSchema.
let playerSchema = new Schema ({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    Salary: { type: Number, required: true }
});

// Create teamSchema.
let teamSchema = new Schema ({
    name: { type: String, required: true },
    mascot: { type: String, required: true },
    players: [playerSchema]
});

// Export "Team" model.
module.exports = mongoose.model("Team", teamSchema); 