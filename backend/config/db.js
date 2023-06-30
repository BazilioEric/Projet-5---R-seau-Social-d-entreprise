const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://" + process.env.DB_UP + "@rs-ent.rdokguv.mongodb.net/RS-ENT-DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.log("Connection échoué à MongoDB", err));
