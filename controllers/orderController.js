const db = require("../config/db");
const Order = require("../models/orderModel");

exports.createOrder = (req, res) => {
  const {
    totalAmount,
    paymentMethod,
    paymentStatus,
    items,
    totalDiscountAmount,
    shippingCharge,
    couponCode,
    rto,
    phone,
    country,
    state,
    city,
    address,
    pincode,
  } = req.body;

  const userId = req.user.id;

  if (!totalAmount || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  // Fetch user info
  db.query(
    "SELECT name, email FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length)
        return res.status(404).json({ error: "User not found" });

      const { name, email } = results[0];

      const orderData = {
        userId,
        name,
        email,
        totalAmount,
        paymentMethod: paymentMethod || "COD",
        paymentStatus: paymentStatus || "pending",
        orderStatus: typeof orderStatus === "number" ? orderStatus : 0,
        totalDiscountAmount: totalDiscountAmount || 0,
        shippingCharge: shippingCharge || 0,
        couponCode: couponCode || null,
        rto: rto || false,
        phone,
        country,
        state,
        city,
        address,
        pincode,
      };

      Order.createOrder(orderData, items, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res
          .status(201)
          .json({ message: "Order placed", orderId: result.orderId });
      });
    }
  );
};

exports.getAllOrders = (req, res) => {
  Order.getAllOrders((err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(orders);
  });
};

exports.getOrderById = (req, res) => {
  Order.getOrderById(req.params.id, (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });
};

exports.updateOrderStatus = (req, res) => {
  Order.updateOrderStatus(req.params.id, req.body.status, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order status updated" });
  });
};

exports.deleteOrder = (req, res) => {
  Order.deleteOrder(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order deleted" });
  });
};
