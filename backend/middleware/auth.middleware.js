const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

// Test de connexion de l'utilisateur //
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user= null;
                res.cookie('jwt', '', { maxAge: 1 });
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                console.log(res.locals.user);
                next();
            }
        })
    } else{
        res.locals.user = null;
        next();
    } 
}

// Première authentification : quand on fait un requireAuth on récupère le token, si on a //
//  un token on fait une vérification JWT. Si pas d'erruer un decoded token sort de la //
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {
                console.log(decodedToken.id);
                next();
            }
        });
    } else{
        console.log('No token');
    }
};