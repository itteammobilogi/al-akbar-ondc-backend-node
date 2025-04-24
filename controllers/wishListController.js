const db = require("../config/db");

// Add userId to product's wishlist
exports.addToProductWishlist = (req, res) => {
  const userId = req.user?.id;
  const { productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ error: "User ID and Product ID are required." });
  }

  db.query(
    "SELECT wishlist FROM products WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      let wishlist = [];
      if (results.length > 0 && results[0].wishlist) {
        try {
          wishlist = JSON.parse(results[0].wishlist);
        } catch {
          wishlist = [];
        }
      }

      if (!wishlist.includes(userId)) {
        wishlist.push(userId);
      }

      db.query(
        "UPDATE products SET wishlist = ? WHERE id = ?",
        [JSON.stringify(wishlist), productId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(200).json({ message: "Added to wishlist." });
        }
      );
    }
  );
};

// Get products in wishlist for a user
exports.getWishlistProductsByUser = (req, res) => {
  const userId = req.user?.id;

  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const wishlistProducts = results.filter((product) => {
      try {
        let wishlist = JSON.parse(product.wishlist || "[]");

        // Handle double-stringified edge case
        if (typeof wishlist === "string") {
          wishlist = JSON.parse(wishlist);
        }

        return Array.isArray(wishlist) && wishlist.includes(Number(userId));
      } catch {
        return false;
      }
    });

    res.status(200).json(wishlistProducts);
  });
};

// Remove userId from product's wishlist
exports.removeFromProductWishlist = (req, res) => {
  const userId = req.user?.id;
  const { productId } = req.params;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ error: "User ID and Product ID are required." });
  }

  db.query(
    "SELECT wishlist FROM products WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      let wishlist = [];
      if (results.length > 0 && results[0].wishlist) {
        try {
          wishlist = JSON.parse(results[0].wishlist);
        } catch {
          wishlist = [];
        }
      }

      const updatedWishlist = wishlist.filter((id) => id !== userId);

      db.query(
        "UPDATE products SET wishlist = ? WHERE id = ?",
        [JSON.stringify(updatedWishlist), productId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(200).json({ message: "Removed from wishlist." });
        }
      );
    }
  );
};
