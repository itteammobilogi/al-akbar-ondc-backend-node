const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/orders", authenticate, orderController.getAllOrders);
router.get("/orders/:id", authenticate, orderController.getOrderById);
router.get("/user/orders", authenticate, orderController.getUserOrders);
router.post("/create/order", authenticate, orderController.createOrder);
router.put("/orders/:id", authenticate, orderController.updateOrderStatus);
router.delete("/orders/:id", authenticate, orderController.deleteOrder);

module.exports = router;
