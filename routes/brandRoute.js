const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const { uploadBrand } = require("../middleware/uploadMiddleware");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

router.post(
  "/createbrand",
  authenticate,
  authorizeAdmin,
  uploadBrand.single("image"),
  brandController.createBrand
);
router.get("/getallbrands", brandController.getAllBrands);
router.get("/getbrandby/:id", brandController.getBrandById);
router.put(
  "/updatebrand/:id",
  authenticate,
  authorizeAdmin,
  uploadBrand.single("image"),
  brandController.updateBrand
);
router.delete(
  "/deletebrand/:id",
  authenticate,
  authorizeAdmin,
  brandController.deleteBrand
);

module.exports = router;
