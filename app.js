// require librairies 
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const path = require('path');

// importation des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

dotenv.config();
const app = express();

//connexion à la base de données 
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// intercepte les requetes avec du json
app.use(express.json());

// Pour éviter les erreurs de CORS 
// Empêche les requêtes malveillantes d'accéder à des ressources sensibles
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

//Intéraction avec la bdd
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de app
module.exports = app;