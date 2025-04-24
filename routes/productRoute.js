const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { uploadProduct } = require("../middleware/uploadMiddleware");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
// const upload = require("../middleware/uploadMiddleware");

// Create product
router.post(
  "/create/product",
  authenticate,
  authorizeAdmin,
  uploadProduct.array("images", 10), // for multiple uploads
  productController.createProduct
);

// Get all products
router.get("/getallproducts", productController.getAllProducts);

// Get single product by ID
router.get("/single/product/:id", productController.getProductById);
// router.get("/search", productController.searchProducts);

// Update product
router.put(
  "/update/product/:id",
  authenticate,
  authorizeAdmin,
  uploadProduct.array("images", 10),
  productController.updateProduct
);

// Delete product
router.delete(
  "/delete/product/:id",
  authenticate,
  authorizeAdmin,
  productController.deleteProduct
);

module.exports = router;
