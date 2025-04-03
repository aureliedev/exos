require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { addUser, verifyUser } = require("./authentification");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

// Middleware d'auth'
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/signin");

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
    if (err) return res.redirect("/signin");
    req.user = decoded;
    next();
  });
};

// Middleware pr autoriser que les admins
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .send("Accès refusé : réservé aux administrateurs ❌");
  }
  next();
};

// Route admin
app.get("/admin", authenticate, authorizeAdmin, (req, res) => {
  const { username, role } = req.user;
  res.render("index", { nom: username, role });
});

// Routes GET
app.get("/", authenticate, (req, res) => {
  const { username, role } = req.user;
  res.render("index", { nom: username, role });
});

app.get("/signup", (req, res) => {
  res.render("signup", { message: null });
});

app.get("/signin", (req, res) => {
  res.render("signin", { message: null });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/signin");
});

// Routes POST
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const role = "user"; // ou "admin"

  addUser(username, password, role, (err, result) => {
    if (err) {
      console.error(err);
      return res.render("signup", {
        message: "Erreur lors de l'inscription ❌",
      });
    }
    res.redirect("/signin");
  });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  verifyUser(username, password, (err, user) => {
    if (err) {
      console.error(err);
      return res.render("signin", {
        message: "Erreur lors de la connexion ❌",
      });
    }
    if (!user) {
      return res.render("signin", { message: "Identifiants invalides ❌" });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    res.redirect("/");
  });
});

//Server
app.listen(port, () => {
  console.log(`Server listen on port ${port} 🚀`);
});
