const db = require("../config/db");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Add to cart
// exports.addToCart = (req, res) => {
//   const userId = req.user?.id;
//   const { productId, quantity } = req.body;

//   if (!userId || !productId || !quantity) {
//     return res
//       .status(400)
//       .json({ error: "userId, productId, and quantity are required." });
//   }

//   // Step 1: Fetch product price
//   Product.getProductById(productId, (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (!result || result.length === 0)
//       return res.status(404).json({ error: "Product not found" });

//     const product = result[0];
//     const price = parseFloat(product.discountPrice || product.price);
//     const totalAmount = price * quantity;

//     // Step 2: Add to cart
//     Cart.addToCart({ userId, productId, quantity }, (err, cartResult) => {
//       if (err) return res.status(500).json({ error: err.message });

//       res.status(200).json({
//         message: "Product added to cart!",
//         productId,
//         quantity,
//         price,
//         totalAmount,
//       });
//     });
//   });
// };

exports.addToCart = async (req, res) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({
      error: "userId, productId, and quantity are required.",
    });
  }

  try {
    // Step 1: Get product
    const product = await Product.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const price = parseFloat(product.discountPrice || product.price);
    const totalAmount = price * quantity;

    // Step 2: Add to cart
    await Cart.addToCart({ userId, productId, quantity });

    return res.status(200).json({
      message: "Product added to cart!",
      productId,
      quantity,
      price,
      totalAmount,
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Get user's cart
exports.getCartByUser = (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
  Cart.getCartByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Update cart item
exports.updateCartItem = (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: "Missing fields." });
  }

  Cart.updateCartItem({ userId, productId, quantity }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cart updated." });
  });
};

// Remove single item
// exports.removeCartItem = (req, res) => {
//   const userId = req.user.id; // from JWT
//   const { productId } = req.params;

//   const query = `DELETE FROM cart WHERE userId = ? AND productId = ?`;
//   db.query(query, [userId, productId], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ success: true, message: "Item removed from cart" });
//   });
// };

exports.removeCartItem = async (req, res) => {
  const userId = req.user.id; // from JWT
  const { productId } = req.params;

  try {
    const [result] = await db.query(
      `DELETE FROM cart WHERE userId = ? AND productId = ?`,
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Clear entire cart
exports.clearCart = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  Cart.clearCart(userId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cart cleared." });
  });
};
