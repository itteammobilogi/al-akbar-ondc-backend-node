// models/productModel.js
const db = require("../config/db");

// CREATE
exports.createProduct = (data, callback) => {
  const {
    name,
    description,
    price,
    discountPrice,
    offerType,
    categoryId,
    brand,
    sizes,
    colors,
    images,
    stock,
    isFeatured,
  } = data;

  const query = `INSERT INTO products 
    (name, description, price, discountPrice, offerType, categoryId, brand, sizes, colors, images, stock, isFeatured) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      name,
      description,
      price,
      discountPrice,
      offerType,
      categoryId,
      brand,
      JSON.stringify(sizes),
      JSON.stringify(colors),
      JSON.stringify(images),
      stock,
      isFeatured,
    ],
    callback
  );
};

// READ ALL
// exports.getAllProducts = (filters, callback) => {
//   let baseQuery = "SELECT * FROM Products WHERE 1=1";
//   const values = [];
//   if (filters.categoryId) {
//     baseQuery += " AND categoryId = ?";
//     values.push(filters.categoryId);
//   }
//   if (filters.brand) {
//     baseQuery += " AND brand = ?";
//     values.push(filters.brand);
//   }
//   if (filters.offerType) {
//     baseQuery += " AND offerType = ?";
//     values.push(filters.offerType);
//   }

//   if (filters.isFeatured) {
//     baseQuery += " AND isFeatured = ?";
//     values.push(filters.isFeatured);
//   }

//   if (filters.exclusive) {
//     baseQuery += " AND is_exclusive = ?";
//     values.push(filters.exclusive);
//   }

//   db.query(baseQuery, values, callback);
// };
exports.getAllProducts = (filters, callback) => {
  let baseQuery = "SELECT * FROM Products WHERE 1=1";
  const values = [];

  if (filters.search) {
    baseQuery += " AND (name LIKE ? OR brand LIKE ?)";
    const q = `%${filters.search}%`;
    values.push(q, q);
  }

  if (filters.categoryId) {
    baseQuery += " AND categoryId = ?";
    values.push(filters.categoryId);
  }

  if (filters.brand) {
    baseQuery += " AND brand = ?";
    values.push(filters.brand);
  }

  if (filters.offerType) {
    baseQuery += " AND offerType = ?";
    values.push(filters.offerType);
  }

  if (filters.isFeatured) {
    baseQuery += " AND isFeatured = ?";
    values.push(filters.isFeatured);
  }

  if (filters.exclusive) {
    baseQuery += " AND is_exclusive = ?";
    values.push(filters.exclusive);
  }

  db.query(baseQuery, values, callback);
};

// READ BY ID
exports.getProductById = (id, callback) => {
  db.query("SELECT * FROM products WHERE id = ?", [id], callback);
};

// UPDATE
// exports.updateProduct = (id, data, callback) => {
//   const {
//     name,
//     description,
//     price,
//     discountPrice,
//     offerType,
//     categoryId,
//     brand,
//     sizes,
//     colors,
//     images,
//     stock,
//     isFeatured,
//   } = data;

//   const query = `UPDATE products SET
//     name = ?, description = ?, price = ?, discountPrice = ?, offerType = ?, categoryId = ?, brand = ?,
//     sizes = ?, colors = ?, images = ?, stock = ?, isFeatured = ?
//     WHERE id = ?`;

//   db.query(
//     query,
//     [
//       name,
//       description,
//       price,
//       discountPrice,
//       offerType,
//       categoryId,
//       brand,
//       JSON.stringify(sizes),
//       JSON.stringify(colors),
//       JSON.stringify(images),
//       stock,
//       isFeatured,
//       id,
//     ],
//     callback
//   );
// };

exports.updateProduct = (id, data, callback) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) {
    return callback(null, { affectedRows: 0 });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const query = `UPDATE products SET ${setClause} WHERE id = ?`;

  values.push(id); // Add productId at the end for WHERE clause

  db.query(query, values, callback);
};

// DELETE
exports.deleteProduct = (id, callback) => {
  db.query("DELETE FROM products WHERE id = ?", [id], callback);
};
