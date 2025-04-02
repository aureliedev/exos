require("dotenv").config();
const express = require("express");
const { addUser, verifyUser } = require("./authentification");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true })); // Pr les form'
app.use(express.json());
app.set("view engine", "ejs");

// Routes GET
app.get("/", (req, res) => {
  res.render("index", { nom: null });
});

app.get("/signup", (req, res) => {
  res.render("signup", { message: null });
});

app.get("/signin", (req, res) => {
  res.render("signin", { message: null });
});

// Routes POST
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  addUser(username, password, (err, result) => {
    if (err) {
      console.error(err);
      return res.render("signup", {
        message: "Erreur lors de l'inscription ❌",
      });
    }
    // Redirige vers signin après signup
    res.redirect("/signin");
  });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  verifyUser(username, password, (err, isValid) => {
    if (err) {
      console.error(err);
      return res.render("signin", {
        message: "Erreur lors de la connexion ❌",
      });
    }
    if (!isValid) {
      return res.render("signin", { message: "Identifiants invalides ❌" });
    }
    // Redirige vers / après signin
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Server listen on port ${port} 🚀`);
});
