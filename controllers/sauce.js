const Sauce = require('../models/sauce');
const fs = require('fs');

//création d'une sauce
exports.create = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
    .catch(error => { res.status(400).json({ error }) })
};

exports.getOne = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//modifier une sauce
exports.modify = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//supprimer une sauce
exports.delete = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getAll = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.like = (req, res, next) => { // Exportation de la fonction "like" pour être utilisée dans d'autres fichiers
  Sauce.findOne({ _id: req.params.id }) // Recherche de la sauce correspondante à l'id dans la base de données
    .then((sauce) => { // Si la sauce est trouvée, exécuter la fonction suivante
      switch (req.body.like) { // Vérifier la valeur de "like" envoyée dans la requête HTTP
        case 1: // Si "like" est égal à 1, exécuter la fonction suivante
          if (!sauce.usersLiked.includes(req.body.userId)) { // Vérifier si l'utilisateur a déjà aimé cette sauce
            Sauce.updateOne({ _id: req.params.id }, // Mettre à jour les informations de la sauce dans la base de données
              {
                // opérateurs MongoDB "$inc" et "$push"
                $inc: { likes: +1 }, // Ajouter 1 au nombre total de likes
                $push: { usersLiked: req.body.userId }, // Ajouter l'id de l'utilisateur à la liste des utilisateurs ayant aimé la sauce
              }
            )
              .then(() => { // Si la mise à jour est réussie, envoyer une réponse HTTP 200 avec un message de confirmation
                res.status(200).json({message: 'Like ajouté'});
              })
              .catch(function (error) { // Si la mise à jour échoue, envoyer une réponse HTTP 400 avec un message d'erreur
                res.status(400).json({ error: error });
              });
          }
          break;
        default: // Si la valeur de "like" n'est pas 1, envoyer une réponse HTTP 400 avec un message d'erreur
          res.status(400).json({ message: 'Problème like' });
      }
    }).catch((error) => { // Si la recherche de la sauce échoue, envoyer une réponse HTTP 400 avec un message d'erreur
      res.status(400).json({error: error,});
    });
};