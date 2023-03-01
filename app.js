const express = require('express');
const mongoose = require('mongoose');

// mongodb+srv://mathiasteddy:<password>@cluster0.uze0as9.mongodb.net/?retryWrites=true&w=majority

const stuffRoutes = require('./routes/stuff');


// importation de la routes user
const userRoutes = require('./routes/user');
// FIN importation de la routes user

mongoose.connect('mongodb+srv://mathiasteddy:bozptpnGdmEixPHx@cluster0.uze0as9.mongodb.net/?retryWrites=true&w=majority',
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