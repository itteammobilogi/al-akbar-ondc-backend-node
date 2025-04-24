const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticate } = require("../middleware/authMiddleware");

// router.post("/addtocart", authenticate, cartController.addToCart);
router.post("/addtocart", authenticate, cartController.addToCart);
router.get("/user", authenticate, cartController.getCartByUser);
router.put("/update/cart", cartController.updateCartItem);
router.delete(
  "/remove/cart/:productId",
  authenticate,
  cartController.removeCartItem
);
router.delete("/clear/cart", authenticate, cartController.clearCart);

module.exports = router;
