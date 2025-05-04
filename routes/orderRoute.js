const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

router.get(
  "/admin/getallorders",
  authenticate,
  authorizeAdmin,
  orderController.getAllOrders
);
router.get("/orders/:id", authenticate, orderController.getOrderById);
router.get("/user/orders", authenticate, orderController.getUserOrders);
router.post("/create/order", authenticate, orderController.createOrder);
router.put(
  "/:id/status",
  authenticate,
  authorizeAdmin,
  orderController.updateOrderStatus
);
router.delete(
  "/orders/:id",
  authenticate,
  authorizeAdmin,
  orderController.deleteOrder
);

module.exports = router;
