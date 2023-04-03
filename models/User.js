const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schéma de données d'un utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Exportation du model user
module.exports = mongoose.model('user', userSchema);