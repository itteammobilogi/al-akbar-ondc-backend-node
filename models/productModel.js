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
// exports.createProduct = async (data, callback) => {
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
//     is_exclusive,
//   } = data;

//   const query = `INSERT INTO products
//     (name, description, price, discountPrice, offerType, categoryId, brand, sizes, colors, images, stock, isFeatured,is_exclusive)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`;

//   try {
//     const [result] = await db.query(query, [
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
//       is_exclusive,
//     ]);
//     callback(null, result);
//   } catch (err) {
//     callback(err);
//   }
// };

exports.createProduct = async (data, callback) => {
  const {
    name,
    description,
    price,
    discountPrice = null,
    offerType = null,
    categoryId,
    brand = "",
    sizes = [],
    colors = [],
    images = [],
    stock = 0,
    isFeatured = 0,
    is_exclusive = 0,
    variants = [],
  } = data;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Insert base product
    const [prodResult] = await conn.query(
      `INSERT INTO products
         (name, description, price, discountPrice,
          offerType, categoryId, brand,
          sizes, colors, images,
          stock, isFeatured, is_exclusive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        is_exclusive,
      ]
    );

    const productId = prodResult.insertId;

    // 2) Insert each variant row
    if (variants.length) {
      const variantValues = variants.map((v) => [
        productId,
        v.color,
        v.image,
        v.stock,
      ]);
      await conn.query(
        `INSERT INTO products_variants
           (product_id, color, images, stock)
         VALUES ?`,
        [variantValues]
      );
    }

    await conn.commit();
    callback(null, { productId });
  } catch (err) {
    await conn.rollback();
    console.error("createProduct transaction failed:", err);
    callback(err);
  } finally {
    conn.release();
  }
};

// READ ALL
// exports.getAllProducts = async (filters, callback) => {
//   let baseQuery = "SELECT * FROM products WHERE 1=1";
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

//   if (typeof filters.isFeatured !== "undefined") {
//     baseQuery += " AND isFeatured = ?";
//     values.push(filters.isFeatured);
//   }

//   if (typeof filters.exclusive !== "undefined") {
//     baseQuery += " AND is_exclusive = ?";
//     values.push(filters.exclusive);
//   }

//   if (filters.minPrice) {
//     baseQuery += " AND price >= ?";
//     values.push(filters.minPrice);
//   }

//   if (filters.maxPrice) {
//     baseQuery += " AND price <= ?";
//     values.push(filters.maxPrice);
//   }

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
//       case "idAsc":
//         baseQuery += " ORDER BY id ASC";
//         break;
//       default:
//         baseQuery += " ORDER BY createdAt DESC";
//     }
//   }

//   try {
//     const [results] = await db.query(baseQuery, values);
//     callback(null, results);
//   } catch (err) {
//     callback(err);
//   }
// };

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
      case "idAsc":
        baseQuery += " ORDER BY id ASC";
        break;
      default:
        baseQuery += " ORDER BY createdAt DESC";
    }
  }

  try {
    const [products] = await db.query(baseQuery, values);

    // Attach variant data to each product
    for (const product of products) {
      const [variants] = await db.query(
        "SELECT color, stock, images FROM products_variants WHERE product_id = ?",
        [product.id]
      );
      product.variants = variants;
    }

    callback(null, products);
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

// exports.getProductById = async (id) => {
//   try {
//     const [results] = await db.query("SELECT * FROM products WHERE id = ?", [
//       id,
//     ]);
//     return results[0]; // return the first matched product
//   } catch (err) {
//     console.error("DB Query Error:", err);
//     throw err;
//   }
// };

exports.getProductById = async (id) => {
  try {
    const [results] = await db.query(
      `SELECT 
         p.*, 
         pv.id AS variant_id,
         pv.color AS variant_color,
         pv.images AS variant_images,
         pv.stock AS variant_stock
       FROM products p
       LEFT JOIN products_variants pv ON pv.product_id = p.id
       WHERE p.id = ?`,
      [id]
    );

    if (results.length === 0) return null;

    const product = {
      ...results[0],
      variants: results.map((row) => ({
        id: row.variant_id,
        color: row.variant_color,
        stock: row.variant_stock,
        images: row.variant_images ? [row.variant_images] : [], // treating images as single image path
      })),
    };

    return product;
  } catch (err) {
    console.error("DB Query Error:", err);
    throw err;
  }
};

// exports.getProductById = async (req, res) => {
//   console.log("▶ req.params:", req.params);
//   const { id } = req.params;

//   try {
//     const [[rawProduct]] = await db.query(
//       `
//         SELECT
//           id,
//           name,
//           price,
//           description,
//           discountPrice,
//           images_json   AS images,
//           colors_json   AS colors,
//           size_json     AS sizes,
//           stock,
//           inventoryAlertThreshold
//         FROM products
//         WHERE id = ?
//       `,
//       [id]
//     );

//     if (!rawProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const images = rawProduct.images ? JSON.parse(rawProduct.images) : [];
//     const colors = rawProduct.colors ? JSON.parse(rawProduct.colors) : [];
//     const sizes = rawProduct.sizes ? JSON.parse(rawProduct.sizes) : [];

//     const [variants] = await db.query(
//       `SELECT color, image, stock
//        FROM product_variants
//        WHERE product_id = ?`,
//       [id]
//     );

//     res.json({
//       id: rawProduct.id,
//       name: rawProduct.name,
//       description: rawProduct.description,
//       price: rawProduct.price,
//       discountPrice: rawProduct.discountPrice,
//       images,
//       colors,
//       sizes,
//       variants,
//       stock: rawProduct.stock,
//       inventoryAlertThreshold: rawProduct.inventoryAlertThreshold,
//     });
//   } catch (error) {
//     console.error("getProductDetail error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// UPDATE (dynamic keys)
// exports.updateProduct = async (id, data, callback) => {
//   const keys = Object.keys(data);
//   const values = Object.values(data);

//   if (keys.length === 0) {
//     return callback(null, { affectedRows: 0 });
//   }

//   const setClause = keys.map((key) => `${key} = ?`).join(", ");
//   const query = `UPDATE products SET ${setClause} WHERE id = ?`;
//   values.push(id);

//   try {
//     const [result] = await db.query(query, values);
//     callback(null, result);
//   } catch (err) {
//     callback(err);
//   }
// };

exports.updateProduct = async (id, data, callback) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // ✅ Filter out 'variants' from the update query
    const keys = Object.keys(data).filter((k) => k !== "variants");
    const values = keys.map((k) => data[k]);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const productQuery = `UPDATE products SET ${setClause} WHERE id = ?`;
    values.push(id);
    await conn.query(productQuery, values);

    // Clear old variants
    await conn.query(`DELETE FROM products_variants WHERE product_id = ?`, [
      id,
    ]);

    // Insert new variants
    const variants = JSON.parse(data.variants || "[]");

    for (const variant of variants) {
      const { color, stock, image } = variant;
      await conn.query(
        `INSERT INTO products_variants (product_id, color, stock, images) VALUES (?, ?, ?, ?)`,
        [id, color, stock, image || null]
      );
    }

    await conn.commit();
    callback(null, { success: true });
  } catch (err) {
    await conn.rollback();
    callback(err);
  } finally {
    conn.release();
  }
};

// DELETE
exports.deleteProduct = async (id, callback) => {
  try {
    // Delete dependent order items first
    await db.query("DELETE FROM order_items WHERE productId = ?", [id]);

    // Then delete the product
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);

    callback(null, result);
  } catch (err) {
    callback(err);
  }
};
