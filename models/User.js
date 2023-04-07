const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,15})+$/;

// Schéma de données d'un utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, trimp: true, lowercase: true, match: [emailRegex, "Veuillez entrer une adresse email correcte"] },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Exportation du model user
module.exports = mongoose.model('user', userSchema);