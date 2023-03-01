const express = require('express');
const mongoose = require('mongoose');

// mongodb+srv://mathiasteddy:<password>@cluster0.uze0as9.mongodb.net/?retryWrites=true&w=majority

const stuffRoutes = require('./routes/stuff');

// importation de la routes user
const userRoutes = require('./routes/user');
// FIN importation de la routes user

const dotenv = require("dotenv").config();

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CLUSTER = process.env.DB_CLUSTER; 

mongoose.connect("mongodb+srv://" + DB_USERNAME + ":" + DB_PASSWORD + "@" + DB_CLUSTER + ".mongodb.net/?retryWrites=true&w=majority",

{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !')) 
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();
 
// intercepte les requetes avec du json
app.use(express.json());

app.use('/api/stuff', stuffRoutes);

//Enregistrer les routes utilisateurs
app.use('/api/auth/signup', userRoutes);
//fin utilisateurs

module.exports = app;