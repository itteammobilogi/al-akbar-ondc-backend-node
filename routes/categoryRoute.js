const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

router.get("/getallcategores", categoryController.getAllCategories);
router.get("/getcategory/:id", categoryController.getCategoryById);
router.post(
  "/createcategory",
  authenticate,
  authorizeAdmin,
  categoryController.createCategory
);
router.put(
  "/updatecategory/:id",
  authenticate,
  authorizeAdmin,
  categoryController.updateCategory
);
router.delete(
  "/deletecategory/:id",
  authenticate,
  authorizeAdmin,
  categoryController.deleteCategory
);

module.exports = router;
