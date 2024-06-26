
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const dotenv = require("dotenv").config();
const tokenKey = process.env.tokenKey;


// Exporte la fonction signup qui permet de créer un nouvel utilisateur dans la base de données.
exports.signup = (req, res, next) => {
  const passwordRegex = new RegExp(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/);

  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: "le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, un caractère spécial et d'une longueur d'au moins 8 caractères",
    });
    return;
  }
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Exporte la fonction login qui permet à un utilisateur existant de s'authentifier.
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Informations incorrectes !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Informations incorrectes !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              tokenKey,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};