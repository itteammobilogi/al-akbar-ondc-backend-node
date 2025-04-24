const db = require("../config/db");

// Create new user
exports.createUser = (name, email, hashedPassword, role = "user") => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, hashedPassword, role], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Find user by email
exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};
