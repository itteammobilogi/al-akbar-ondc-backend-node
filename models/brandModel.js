const db = require("../config/db");

exports.createBrand = (data, callback) => {
  const query = "INSERT INTO brands (name, image) VALUES (?, ?)";
  db.query(query, [data.name, data.image], callback);
};

exports.getAllBrands = (callback) => {
  db.query("SELECT * FROM brands", callback);
};

exports.getBrandById = (id, callback) => {
  db.query("SELECT * FROM brands WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

exports.updateBrand = (id, data, callback) => {
  const query = "UPDATE brands SET name = ?, image = ? WHERE id = ?";
  db.query(query, [data.name, data.image, id], callback);
};

exports.deleteBrand = (id, callback) => {
  db.query("DELETE FROM brands WHERE id = ?", [id], callback);
};
