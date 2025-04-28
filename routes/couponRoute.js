const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Reward a coupon
router.post("/reward", authenticate, couponController.rewardCoupon);

router.post(
  "/admin/coupons/create",
  authenticate,
  authorizeAdmin,
  couponController.createCoupon
);

// Fetch user's active coupons
router.get("/my-coupons", authenticate, couponController.getMyCoupons);

// Validate coupon at checkout
router.post("/validate/apply", authenticate, couponController.validateCoupon);

// Admin manage coupons
router.put(
  "/admin/coupons/edit/:id",
  authenticate,
  authorizeAdmin,
  couponController.editCoupon
);
router.delete(
  "/admin/coupons/delete/:id",
  authenticate,
  authorizeAdmin,
  couponController.deleteCoupon
);
router.post("/auto-reward", authenticate, couponController.autoRewardCoupon);
router.get("/get/user/coupon", authenticate, couponController.getMyCoupons);

module.exports = router;
