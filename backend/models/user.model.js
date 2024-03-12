const  mongoose = require('mongoose');

// Variable qui fonctinne avec la dépendance Validator pour que l'email soit bien correspondant à la syntaxe d'un e-mail //
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

//Schéma d'un utlisateur
const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
        },
        password:{
            type: String,
            required: true,
            max: 1024,
            minlength: 6 
        },
        picture: {
            type: String,
            defaut: ""
        },
        bio: {
            type: String,
            max: 1024,
        },
        abonnements:{
            type: [String]
        },
        abonnés: {
            type: [String]
        },
        likes:{
            type: [String]
        }
    },
    {
        timestamps: true,
    }
)

// Fonction avant la sauvegarde dans la BDD //
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Fonction de désalage du password pour le login //
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};


const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;