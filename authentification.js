const bcrypt = require("bcrypt");
const db = require("./db");

const addUser = (username, password, callback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(sql, [username, hashedPassword], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  });
};

const verifyUser = (username, password, callback) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, false);

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  });
};

module.exports = { addUser, verifyUser };
