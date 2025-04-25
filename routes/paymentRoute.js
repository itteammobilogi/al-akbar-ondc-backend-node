const express = require("express");
const router = express.Router();
const paymentCtrl = require("../controllers/paymentController.js");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/razorpay/order", authenticate, paymentCtrl.createRazorpayOrder);
router.post(
  "/razorpay/verify",
  authenticate,
  paymentCtrl.verifyRazorpaySignature
);
router.post("/cod", authenticate, paymentCtrl.handleCOD); // optional
// router.post("/razorpay/webhook", paymentController.handleWebhook);
// router.post("/razorpay/webhook", paymentCtrl.handleWebhook);

module.exports = router;
