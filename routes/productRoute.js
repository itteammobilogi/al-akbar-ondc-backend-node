const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const { uploadProduct } = require("../middleware/uploadMiddleware");
// const upload = require("../middleware/uploadMiddleware");

// Create product
// router.post(
//   "/create/product",
//   authenticate,
//   authorizeAdmin,
//   uploadProduct.array("images", 10),
//   productController.createProduct
// );

router.post(
  "/create/product",
  authenticate,
  authorizeAdmin,
  // uploadProduct.fields([
  //   { name: "images", maxCount: 10 },
  //   { name: "variantImages", maxCount: 20 },
  // ]),
  uploadProduct,
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
  // uploadProduct.array("images", 10),
  uploadProduct,
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
