const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const {
  addToProductWishlist,
  getWishlistProductsByUser,
  removeFromProductWishlist,
} = require("../controllers/wishListController");

// Add to wishlist
router.post("/add/wishlist", authenticate, addToProductWishlist);

// Get wishlist products for logged-in user
router.get("/get/wishlist", authenticate, getWishlistProductsByUser);

// Remove from wishlist
router.delete(
  "/remove/wishlist/:productId",
  authenticate,
  removeFromProductWishlist
);

module.exports = router;
