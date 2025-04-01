require("dotenv").config();
const express = require("express");
const { addUser, verifyUser } = require("./authentification");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("on index");
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  addUser(username, password, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de l'inscription");
    }
    res.send("Utilisateur inscrit avec succès ✅");
  });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  verifyUser(username, password, (err, isValid) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la connexion");
    }
    if (!isValid) {
      return res.status(401).send("Identifiants invalides");
    }
    res.send("Connexion de l'utilisateur réussie ✅");
  });
});

app.listen(port, () => {
  console.log(`Server listen on port ${port} 🚀`);
});
