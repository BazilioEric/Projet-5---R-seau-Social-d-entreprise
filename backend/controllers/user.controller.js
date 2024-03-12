// Appel de la BDD //
const UserModel = require('../models/user.model');

// Vérification que les ID sont reconnus par la BDD //
const ObjectID = require('mongoose').Types.ObjectId;

// 1 Obtenir tout les utilisateurs //
module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

// Récupération des infos du profil à la connexion //
module.exports.userInfo = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnue : ' + req.params.id);

    const docs = await UserModel.findById(req.params.id).select('-password');
    res.send(docs);
    };

// Modification du profil //
module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnue : ' + req.params.id)

    try{
        docs = await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
              $set: {
                bio: req.body.bio
              }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true}
          );
          return res.send(docs);
        } catch (err) {
          return res.status(500).json({ message: err});
        }
};

// Supression d'un profil //
module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnue : ' + req.params.id)

        try {
            await UserModel.deleteOne({_id: req.params.id}).exec();
            res.status(200).json({ message: "Supression réussie! "});
          } catch (err) {
            return res.status(500).json({ message: err});
          }
};

// S'abonner à un utilisateur //
module.exports.follow = async (req, res) => {
    if (
        !ObjectID.isValid(req.params.id) || 
        !ObjectID.isValid(req.body.idToFollow)
        )
        return res.status(400).send('ID inconnue : ' + req.params.id);

        try{
            // Ajout à la liste d'abonnements //
            const updatedUser = await UserModel.findByIdAndUpdate(
                req.params.id,
                { $addToSet: { abonnements : req.body.idToFollow }},
                { new: true, upsert: true}
            );
            res.status(201).json(updatedUser);
            // Ajout à la liste des abonnés //
            await UserModel.findByIdAndUpdate(
                req.body.idToFollow,
                { $addToSet: { abonnés: req.params.id }},
                { new: true, upsert: true}
            );
        } catch (err) {
            return res.status(500).json({ message: err });
        }
};

// Se désabonner d'un utilisateur //
module.exports.unfollow = async (req, res) => {
    if (
        !ObjectID.isValid(req.params.id) || 
        !ObjectID.isValid(req.body.idToUnfollow)
        )
        return res.status(400).send('ID inconnue : ' + req.params.id);

        try{
            // Retirer de la liste d'abonnements //
            const updatedUser = await UserModel.findByIdAndUpdate(
                req.params.id,
                { $pull: { abonnements : req.body.idToUnfollow }},
                { new: true, upsert: true}
            );
            res.status(201).json(updatedUser);
            // Retirer de la liste des abonnés //
            await UserModel.findByIdAndUpdate(
                req.body.idToUnfollow,
                { $pull: { abonnés: req.params.id }},
                { new: true, upsert: true}
            );
        } catch (err) {
            return res.status(500).json({ message: err });
        }
};