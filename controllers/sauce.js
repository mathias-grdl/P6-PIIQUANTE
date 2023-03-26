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

// exports.like = (req, res, next) => {
//   Sauce.findOne({ _id: req.params.id }) // Recherche de la sauce correspondante à l'id dans la base de données
//     .then((sauce) => { // Si la sauce est trouvée, exécuter la fonction suivante
//       switch (req.body.like) { // Vérifier la valeur de "like"
//         //Like
//         case 1: // Si "like" est égal à 1
//           if (!sauce.usersLiked.includes(req.body.userId)) { // Vérifier si l'utilisateur a déjà aimé cette sauce
//             Sauce.updateOne({ _id: req.params.id }, // Mettre à jour les informations de la sauce dans la base de données
//               {
//                 // opérateurs MongoDB "$inc" et "$push"
//                 $inc: { likes: +1 }, // Ajouter 1 au nombre total de likes
//                 $push: { usersLiked: req.body.userId }, // Ajouter l'id de l'utilisateur à la liste des utilisateurs ayant aimé la sauce
//               }
//             )
//               .then(() => { // Si la mise à jour est réussie, message de confirmation
//                 res.status(200).json({ message: 'Like ajouté' });
//               })
//               .catch(function (error) { // Si la mise à jour échoue, message d'erreur
//                 res.status(400).json({ error: error });
//               });
//           }
//           break;

//         //Dislike 
//         case -1: // Si "like" est égal à 1
//           if (!sauce.usersDisliked.includes(req.body.userId)) { // Vérifier si l'utilisateur a déjà aimé cette sauce
//             Sauce.updateOne({ _id: req.params.id }, // Mettre à jour les informations de la sauce dans la base de données
//               {
//                 // opérateurs MongoDB "$inc" et "$push"
//                 $inc: { likes: -1 }, // Ajouter 1 au nombre total de likes
//                 $push: { usersDisliked: req.body.userId }, // Ajouter l'id de l'utilisateur à la liste des utilisateurs ayant aimé la sauce
//               }
//             )
//               .then(() => { // Si la mise à jour est réussie, message de confirmation
//                 res.status(200).json({ message: 'Dislike ajouté' });
//               })
//               .catch(function (error) { // Si la mise à jour échoue, message d'erreur
//                 res.status(400).json({ error: error });
//               });
//           }
//           break;

//         //neutre 
//         case 0:
//           if (sauce.usersDisliked.includes(req.body.userId)) {
//             Sauce.updateOne(
//               { _id: req.params.id },
//               {
//                 $inc: { dislikes: -1 },
//                 $pull: { usersDisliked: req.body.userId },
//               }
//             )
//               .then(() => {
//                 res.status(200).json({
//                   message: "Dislike annulé !",
//                 });
//               })
//               .catch(function (error) {
//                 res.status(400).json({ error: error });
//               });
//           }
//           if (sauce.usersLiked.includes(req.body.userId)) {
//             Sauce.updateOne(
//               { _id: req.params.id },
//               {
//                 $inc: { likes: -1 },
//                 $pull: { usersLiked: req.body.userId },
//               }
//             )
//               .then(() => {
//                 res.status(200).json({
//                   message: "Like annulé !",
//                 });
//               })
//               .catch(function (error) {
//                 res.status(400).json({ error: error });
//               });
//           }
//           break;
//         default: // Si la valeur de "like" n'est pas 1, message d'erreur
//           res.status(400).json({ message: 'Problème like' });
//       }
//     }).catch((error) => { // Si la recherche de la sauce échoue, message d'erreur
//       res.status(400).json({ error: error, });
//     });
// };




exports.like = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // Recherche de la sauce correspondante à l'id dans la base de données
    .then((sauce) => { // Si la sauce est trouvée, exécuter la fonction suivante
      let update = {};
      let message = "";
      switch (req.body.like) { // Vérifier la valeur de "like"
        case 1: // Si "like" est égal à 1
          if (!sauce.usersLiked.includes(req.body.userId)) { // Vérifier si l'utilisateur a déjà aimé cette sauce
            update = {
              // opérateurs MongoDB "$inc" et "$push"
              $inc: { likes: +1 },
              $push: { usersLiked: req.body.userId },
            };
            message = "Like ajouté";
          }
          break;
        case -1: // Si "like" est égal à -1
          if (!sauce.usersDisliked.includes(req.body.userId)) {
            update = {
              $inc: { dislikes: +1 },
              $push: { usersDisliked: req.body.userId },
            };
            message = "Dislike ajouté";
          }
          break;
        case 0:
          if (sauce.usersLiked.includes(req.body.userId)) {
            update = {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
            };
            message = "Like annulé !";
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
            update = {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            };
            message = "Dislike annulé !";
          }
          else {
            res.status(400).json({ message: "Aucune réaction" });
          }
          break;
        default:
          res.status(400).json({ message: "Problème like." });
      }
      Sauce.updateOne({ _id: req.params.id }, update) // Mettre à jour les informations de la sauce dans la base de données
        .then(() => {
          res.status(200).json({ message: message });
        })
    })
    .catch((error) => {
      res.status(400).json({ error: error, });
    });
};
