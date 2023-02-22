const express = require('express');

const app = express();

// middleware
app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

// middleware
app.use((req, res, next) => {
  res.status(201);
  next();
});

// middleware
app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

// middleware
app.use((req, res) => {
  console.log('Réponse envoyée avec succès !');
});

module.exports = app;