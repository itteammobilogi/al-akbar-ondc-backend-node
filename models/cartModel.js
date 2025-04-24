const db = require("../config/db");

// ADD TO CART
exports.addToCart = (data, callback) => {
  const { userId, productId, quantity } = data;

  const query = `
    INSERT INTO cart (userId, productId, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + ?`;

  db.query(query, [userId, productId, quantity, quantity], callback);
};

// GET USER CART
exports.getCartByUser = (userId, callback) => {
  const query = `
    SELECT c.id, c.productId, c.quantity, p.name, p.price, p.discountPrice, p.images
    FROM cart c
    JOIN products p ON c.productId = p.id
    WHERE c.userId = ?`;

  db.query(query, [userId], callback);
};

// UPDATE CART ITEM
exports.updateCartItem = (data, callback) => {
  const { userId, productId, quantity } = data;

  const query = `UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?`;

  db.query(query, [quantity, userId, productId], callback);
};

// REMOVE ITEM
exports.removeCartItem = (userId, productId, callback) => {
  const query = `DELETE FROM cart WHERE userId = ? AND productId = ?`;
  db.query(query, [userId, productId], callback);
};

// CLEAR USER CART
exports.clearCart = (userId, callback) => {
  db.query(`DELETE FROM cart WHERE userId = ?`, [userId], callback);
};
