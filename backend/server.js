const express = require("express");//1
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/user.routes");//3
const postRoutes = require("./routes/post.routes");//4
require("dotenv").config({ path: "./config/.env" });//1
require("./config/db");//2
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const cors = require('cors');

const app = express();


//??Ajouter les options cors??//


app.use(cors({origin : process.env.CLIENT_URL}));

//Pour les cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// JWT //
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});

// Routes //
app.use("/api/user", userRoutes);//3
app.use("/api/post", postRoutes);//4

// Serveur 1 //
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
