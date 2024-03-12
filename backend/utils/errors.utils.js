//Erreur création de compte

module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo"))
    errors.pseudo = "Pseudo incorrect ou déjà pris!";

  if (err.message.includes("email"))
    errors.email = "Email incorrect ou déjà pris!";

  if (err.message.includes("password"))
    errors.password =
      "Le mot de passe doit etre composé d'au moins 6 caractère!";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "Ce pseudo est déjà enregistré!";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Cet email est déjà enregistré!";

  return errors;
};


//Erreur connexion

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email")) errors.email = "Email inconnu!";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe ne correspond pas!";

  return errors;
};


//Erreur téléchargement img
module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };

  if (err.message.includes("invalid file"))
    errors.format = "Format incompatabile";

  if (err.message.includes("max size"))
    errors.maxSize = "Le fichier dépasse 500ko";

  return errors;
};
