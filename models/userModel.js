// const db = require("../config/db");

// // Create new user
// exports.createUser = (
//   name,
//   email,
//   hashedPassword,
//   role = "user",
//   dob = null
// ) => {
//   return new Promise((resolve, reject) => {
//     const query =
//       "INSERT INTO users (name, email, password, role, dob, createdAt) VALUES (?, ?, ?, ?, ?, NOW())";
//     db.query(query, [name, email, hashedPassword, role, dob], (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

// // Find user by email
// exports.findUserByEmail = (email) => {
//   return new Promise((resolve, reject) => {
//     const query = "SELECT * FROM users WHERE email = ?";
//     db.query(query, [email], (err, results) => {
//       if (err) return reject(err);
//       resolve(results[0]);
//     });
//   });
// };

// exports.findUserById = (id) => {
//   return new Promise((resolve, reject) => {
//     const query = "SELECT * FROM users WHERE id = ?";
//     db.query(query, [id], (err, results) => {
//       if (err) return reject(err);
//       resolve(results[0]);
//     });
//   });
// };

// exports.updateUser = (id, name, email, hashedPassword) => {
//   return new Promise((resolve, reject) => {
//     const query =
//       "UPDATE users SET name = ?, email = ?, password = ?, updatedAt = NOW() WHERE id = ?";
//     db.query(query, [name, email, hashedPassword, id], (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

const db = require("../config/db");

// Create new user
exports.createUser = async (
  name,
  email,
  hashedPassword,
  role = "user",
  dob = null
) => {
  const query = `
    INSERT INTO users (name, email, password, role, dob, createdAt) 
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  const [result] = await db.query(query, [
    name,
    email,
    hashedPassword,
    role,
    dob,
  ]);
  return result;
};

// Find user by email
exports.findUserByEmail = async (email) => {
  const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return results[0];
};

// Find user by ID
exports.findUserById = async (id) => {
  const [results] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return results[0];
};

// Update user
exports.updateUser = async (id, name, email, hashedPassword) => {
  const query = `
    UPDATE users SET name = ?, email = ?, password = ?, updatedAt = NOW() 
    WHERE id = ?
  `;

  const [result] = await db.query(query, [name, email, hashedPassword, id]);
  return result;
};
