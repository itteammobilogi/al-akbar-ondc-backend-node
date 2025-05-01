// const db = require("../config/db");

// exports.getAllCategories = (callback) => {
//   db.query("SELECT * FROM categories", callback);
// };

// exports.getCategoryById = (id, callback) => {
//   db.query("SELECT * FROM categories WHERE id = ?", [id], (err, results) => {
//     if (err) return callback(err);
//     callback(null, results[0]);
//   });
// };

// exports.createCategory = (data, callback) => {
//   const { name, description } = data;
//   db.query(
//     "INSERT INTO categories (name, description) VALUES (?, ?)",
//     [name, description],
//     callback
//   );
// };

// exports.updateCategory = (id, data, callback) => {
//   const { name, description } = data;
//   db.query(
//     "UPDATE categories SET name = ?, description = ? WHERE id = ?",
//     [name, description, id],
//     callback
//   );
// };

// exports.deleteCategory = (id, callback) => {
//   db.query("DELETE FROM categories WHERE id = ?", [id], callback);
// };

const db = require("../config/db");

exports.getAllCategories = async (callback) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

exports.getCategoryById = async (id, callback) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    callback(null, rows[0]);
  } catch (err) {
    callback(err);
  }
};

exports.createCategory = async (data, callback) => {
  const { name, description } = data;
  try {
    const [result] = await db.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description]
    );
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

exports.updateCategory = async (id, data, callback) => {
  const { name, description } = data;
  try {
    const [result] = await db.query(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

exports.deleteCategory = async (id, callback) => {
  try {
    const [result] = await db.query("DELETE FROM categories WHERE id = ?", [
      id,
    ]);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};
