// // models/productModel.js
// const db = require("../config/db");

// // CREATE
// exports.createProduct = (data, callback) => {
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

//   const query = `INSERT INTO products
//     (name, description, price, discountPrice, offerType, categoryId, brand, sizes, colors, images, stock, isFeatured)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
//     ],
//     callback
//   );
// };

// // READ ALL
// // exports.getAllProducts = (filters, callback) => {
// //   let baseQuery = "SELECT * FROM Products WHERE 1=1";
// //   const values = [];
// //   if (filters.categoryId) {
// //     baseQuery += " AND categoryId = ?";
// //     values.push(filters.categoryId);
// //   }
// //   if (filters.brand) {
// //     baseQuery += " AND brand = ?";
// //     values.push(filters.brand);
// //   }
// //   if (filters.offerType) {
// //     baseQuery += " AND offerType = ?";
// //     values.push(filters.offerType);
// //   }

// //   if (filters.isFeatured) {
// //     baseQuery += " AND isFeatured = ?";
// //     values.push(filters.isFeatured);
// //   }

// //   if (filters.exclusive) {
// //     baseQuery += " AND is_exclusive = ?";
// //     values.push(filters.exclusive);
// //   }

// //   db.query(baseQuery, values, callback);
// // };
// // exports.getAllProducts = (filters, callback) => {
// //   let baseQuery = "SELECT * FROM Products WHERE 1=1";
// //   const values = [];

// //   if (filters.search) {
// //     baseQuery += " AND (name LIKE ? OR brand LIKE ?)";
// //     const q = `%${filters.search}%`;
// //     values.push(q, q);
// //   }

// //   if (filters.categoryId) {
// //     baseQuery += " AND categoryId = ?";
// //     values.push(filters.categoryId);
// //   }

// //   if (filters.brand) {
// //     baseQuery += " AND brand = ?";
// //     values.push(filters.brand);
// //   }

// //   if (filters.offerType) {
// //     baseQuery += " AND offerType = ?";
// //     values.push(filters.offerType);
// //   }

// //   if (filters.isFeatured) {
// //     baseQuery += " AND isFeatured = ?";
// //     values.push(filters.isFeatured);
// //   }

// //   if (filters.exclusive) {
// //     baseQuery += " AND is_exclusive = ?";
// //     values.push(filters.exclusive);
// //   }

// //   db.query(baseQuery, values, callback);
// // };

// exports.getAllProducts = (filters, callback) => {
//   let baseQuery = "SELECT * FROM products WHERE 1=1";
//   const values = [];

//   // Category filter
//   if (filters.categoryId) {
//     baseQuery += " AND categoryId = ?";
//     values.push(filters.categoryId);
//   }

//   // Brand filter
//   if (filters.brand) {
//     baseQuery += " AND brand = ?";
//     values.push(filters.brand);
//   }

//   // Offer type filter
//   if (filters.offerType) {
//     baseQuery += " AND offerType = ?";
//     values.push(filters.offerType);
//   }

//   // Featured products filter
//   if (typeof filters.isFeatured !== "undefined") {
//     baseQuery += " AND isFeatured = ?";
//     values.push(filters.isFeatured);
//   }

//   // Exclusive products filter
//   if (typeof filters.exclusive !== "undefined") {
//     baseQuery += " AND is_exclusive = ?";
//     values.push(filters.exclusive);
//   }

//   // Price Range
//   if (filters.minPrice) {
//     baseQuery += " AND price >= ?";
//     values.push(filters.minPrice);
//   }
//   if (filters.maxPrice) {
//     baseQuery += " AND price <= ?";
//     values.push(filters.maxPrice);
//   }

//   // Sorting
//   if (filters.sortBy) {
//     switch (filters.sortBy) {
//       case "new":
//         baseQuery += " ORDER BY createdAt DESC";
//         break;
//       case "lowToHigh":
//         baseQuery += " ORDER BY price ASC";
//         break;
//       case "highToLow":
//         baseQuery += " ORDER BY price DESC";
//         break;
//       default:
//         baseQuery += " ORDER BY createdAt DESC";
//     }
//   } else {
//     baseQuery += " ORDER BY createdAt DESC";
//   }

//   db.query(baseQuery, values, callback);
// };

// // READ BY ID
// exports.getProductById = (id, callback) => {
//   db.query("SELECT * FROM products WHERE id = ?", [id], callback);
// };

// // UPDATE
// // exports.updateProduct = (id, data, callback) => {
// //   const {
// //     name,
// //     description,
// //     price,
// //     discountPrice,
// //     offerType,
// //     categoryId,
// //     brand,
// //     sizes,
// //     colors,
// //     images,
// //     stock,
// //     isFeatured,
// //   } = data;

// //   const query = `UPDATE products SET
// //     name = ?, description = ?, price = ?, discountPrice = ?, offerType = ?, categoryId = ?, brand = ?,
// //     sizes = ?, colors = ?, images = ?, stock = ?, isFeatured = ?
// //     WHERE id = ?`;

// //   db.query(
// //     query,
// //     [
// //       name,
// //       description,
// //       price,
// //       discountPrice,
// //       offerType,
// //       categoryId,
// //       brand,
// //       JSON.stringify(sizes),
// //       JSON.stringify(colors),
// //       JSON.stringify(images),
// //       stock,
// //       isFeatured,
// //       id,
// //     ],
// //     callback
// //   );
// // };

// exports.updateProduct = (id, data, callback) => {
//   const keys = Object.keys(data);
//   const values = Object.values(data);

//   if (keys.length === 0) {
//     return callback(null, { affectedRows: 0 });
//   }

//   const setClause = keys.map((key) => `${key} = ?`).join(", ");
//   const query = `UPDATE products SET ${setClause} WHERE id = ?`;

//   values.push(id); // Add productId at the end for WHERE clause

//   db.query(query, values, callback);
// };

// // DELETE
// exports.deleteProduct = (id, callback) => {
//   db.query("DELETE FROM products WHERE id = ?", [id], callback);
// };

const db = require("../config/db");

// CREATE
exports.createProduct = async (data, callback) => {
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

  try {
    const [result] = await db.query(query, [
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
    ]);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

// READ ALL
exports.getAllProducts = async (filters, callback) => {
  let baseQuery = "SELECT * FROM products WHERE 1=1";
  const values = [];

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

  if (typeof filters.isFeatured !== "undefined") {
    baseQuery += " AND isFeatured = ?";
    values.push(filters.isFeatured);
  }

  if (typeof filters.exclusive !== "undefined") {
    baseQuery += " AND is_exclusive = ?";
    values.push(filters.exclusive);
  }

  if (filters.minPrice) {
    baseQuery += " AND price >= ?";
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    baseQuery += " AND price <= ?";
    values.push(filters.maxPrice);
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "new":
        baseQuery += " ORDER BY createdAt DESC";
        break;
      case "lowToHigh":
        baseQuery += " ORDER BY price ASC";
        break;
      case "highToLow":
        baseQuery += " ORDER BY price DESC";
        break;
      default:
        baseQuery += " ORDER BY createdAt DESC";
    }
  } else {
    baseQuery += " ORDER BY createdAt DESC";
  }

  try {
    const [results] = await db.query(baseQuery, values);
    callback(null, results);
  } catch (err) {
    callback(err);
  }
};

// READ BY ID
// exports.getProductById = async (id, callback) => {
//   try {
//     const [results] = await db.query("SELECT * FROM products WHERE id = ?", [
//       id,
//     ]);
//     callback(null, results[0]);
//   } catch (err) {
//     callback(err);
//   }
// };

exports.getProductById = async (id) => {
  try {
    const [results] = await db.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    return results[0]; // return the first matched product
  } catch (err) {
    console.error("DB Query Error:", err);
    throw err;
  }
};

// UPDATE (dynamic keys)
exports.updateProduct = async (id, data, callback) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) {
    return callback(null, { affectedRows: 0 });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const query = `UPDATE products SET ${setClause} WHERE id = ?`;
  values.push(id);

  try {
    const [result] = await db.query(query, values);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

// DELETE
exports.deleteProduct = async (id, callback) => {
  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};
