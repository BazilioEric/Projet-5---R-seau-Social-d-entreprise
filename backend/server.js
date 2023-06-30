const express = require("express");
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/user.routes");
const { checkUser } = require("./middleware/auth.middleware");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const {checkUser} = require('./middleware/auth.middleware');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// JWT //
app.get('*', checkUser);

// Routes //
app.use("/api/user", userRoutes);

// Serveur //
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
