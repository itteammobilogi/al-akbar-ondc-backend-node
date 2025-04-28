const { getCartByUser } = require("../models/cartModel");
const couponModel = require("../models/couponModel");

exports.createCoupon = async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    usageLimit,
    validFrom,
    validTill,
  } = req.body;

  if (!code || !discountType || !discountValue) {
    return res
      .status(400)
      .json({ success: false, message: "Required fields are missing" });
  }

  try {
    await couponModel.createCoupon({
      code,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      usageLimit: usageLimit || 1,
      validFrom: validFrom || new Date(),
      validTill: validTill || null,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully!",
    });
  } catch (err) {
    console.error("Create Coupon Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// API to reward a coupon to a user
exports.rewardCoupon = async (req, res) => {
  const userId = req.user.id; // assuming authenticate middleware
  const { couponCode } = req.body;

  if (!couponCode) {
    return res
      .status(400)
      .json({ success: false, message: "Coupon code is required" });
  }

  try {
    await couponModel.rewardCouponToUser(userId, couponCode);
    res
      .status(200)
      .json({ success: true, message: "Coupon rewarded successfully" });
  } catch (err) {
    console.error("Reward Coupon Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyCoupons = async (req, res) => {
  const userId = req.user.id;
  try {
    const coupons = await couponModel.getUserCoupons(userId);
    res.status(200).json({ success: true, coupons });
  } catch (err) {
    console.error("Get My Coupons Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch coupons" });
  }
};

// Validate a coupon at checkout
exports.validateCoupon = async (req, res) => {
  const userId = req.user.id;
  const { couponCode, cartTotal } = req.body;

  if (!couponCode || !cartTotal) {
    return res.status(400).json({
      success: false,
      message: "Coupon code and cart total are required",
    });
  }

  try {
    const coupon = await couponModel.validateUserCoupon(
      userId,
      couponCode,
      cartTotal
    );

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired coupon",
      });
    }

    // Clean response with code, discount, validTill
    res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        validTill: coupon.validTill,
      },
    });
  } catch (err) {
    console.error("Coupon Validate Error:", err.message);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to validate coupon",
    });
  }
};

exports.getuserCouponCtrl = async (req, res) => {
  const userId = req.user.id;
  try {
    const coupons = await couponModel.getUserCoupons(userId);
    res.status(200).json({
      coupons: coupons.map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        validTill: coupon.validTill,
        expiresAt: coupon.expiresAt,
      })),
    });
  } catch (error) {
    console.log(error);
  }
};
exports.editCoupon = async (req, res) => {
  const couponId = req.params.id;
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    usageLimit,
    validFrom,
    validTill,
  } = req.body;

  if (!code || !discountType || !discountValue) {
    return res
      .status(400)
      .json({ success: false, message: "Required fields missing" });
  }

  try {
    await couponModel.editCoupon(couponId, {
      code,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      usageLimit: usageLimit || 1,
      validFrom,
      validTill,
    });

    res
      .status(200)
      .json({ success: true, message: "Coupon updated successfully!" });
  } catch (err) {
    console.error("Edit Coupon Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  const couponId = req.params.id;

  try {
    await couponModel.deleteCoupon(couponId);
    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully" });
  } catch (err) {
    console.error("Delete Coupon Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.autoRewardCoupon = (req, res) => {
  const userId = req.user.id;

  getCartByUser(userId, async (err, cartItems) => {
    if (err) {
      console.error("Cart fetch error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let couponCodeToReward = "";

    if (cartItems.length >= 5) {
      couponCodeToReward = "MEGA100";
    } else if (cartItems.length >= 2) {
      couponCodeToReward = "WELCOME50";
    }

    if (!couponCodeToReward) {
      return res
        .status(400)
        .json({ success: false, message: "No reward applicable" });
    }

    try {
      await couponModel.rewardCouponToUser(userId, couponCodeToReward);
      res.status(200).json({ success: true, couponCode: couponCodeToReward });
    } catch (error) {
      console.error("Coupon reward failed at:", err);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to reward coupon",
      });
    }
  });
};
