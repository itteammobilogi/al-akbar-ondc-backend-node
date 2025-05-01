// const db = require("../config/db");

// exports.createBrand = (data, callback) => {
//   const query = "INSERT INTO brands (name, image) VALUES (?, ?)";
//   db.query(query, [data.name, data.image], callback);
// };

// exports.getAllBrands = (callback) => {
//   db.query("SELECT * FROM brands", callback);
// };

// exports.getBrandById = (id, callback) => {
//   db.query("SELECT * FROM brands WHERE id = ?", [id], (err, results) => {
//     if (err) return callback(err);
//     callback(null, results[0]);
//   });
// };

// exports.updateBrand = (id, data, callback) => {
//   const query = "UPDATE brands SET name = ?, image = ? WHERE id = ?";
//   db.query(query, [data.name, data.image, id], callback);
// };

// exports.deleteBrand = (id, callback) => {
//   db.query("DELETE FROM brands WHERE id = ?", [id], callback);
// };

const db = require("../config/db");

exports.createBrand = async (data, callback) => {
  try {
    const [result] = await db.query(
      "INSERT INTO brands (name, image) VALUES (?, ?)",
      [data.name, data.image]
    );
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

exports.getAllBrands = async (callback) => {
  try {
    const [rows] = await db.query("SELECT * FROM brands");
    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

exports.getBrandById = async (id, callback) => {
  try {
    const [rows] = await db.query("SELECT * FROM brands WHERE id = ?", [id]);
    callback(null, rows[0]);
  } catch (err) {
    callback(err);
  }
};

exports.updateBrand = async (id, data, callback) => {
  try {
    const [result] = await db.query(
      "UPDATE brands SET name = ?, image = ? WHERE id = ?",
      [data.name, data.image, id]
    );
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

exports.deleteBrand = async (id, callback) => {
  try {
    const [result] = await db.query("DELETE FROM brands WHERE id = ?", [id]);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};
