// const db = require("../config/db");
// const Order = require("../models/orderModel");

// exports.createOrder = (req, res) => {
//   const {
//     totalAmount,
//     paymentMethod,
//     paymentStatus,
//     items,
//     totalDiscountAmount,
//     shippingCharge,
//     couponCode,
//     rto,
//     phone,
//     country,
//     state,
//     city,
//     address,
//     pincode,
//   } = req.body;

//   const userId = req.user.id;

//   if (!totalAmount || !items || !Array.isArray(items) || items.length === 0) {
//     return res.status(400).json({ error: "Missing or invalid fields" });
//   }

//   // Fetch user info
//   db.query(
//     "SELECT name, email FROM users WHERE id = ?",
//     [userId],
//     (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!results.length)
//         return res.status(404).json({ error: "User not found" });

//       const { name, email } = results[0];

//       const orderData = {
//         userId,
//         name,
//         email,
//         totalAmount,
//         paymentMethod: paymentMethod || "COD",
//         paymentStatus: paymentStatus || "pending",
//         orderStatus: typeof orderStatus === "number" ? orderStatus : 0,
//         totalDiscountAmount: totalDiscountAmount || 0,
//         shippingCharge: shippingCharge || 0,
//         couponCode: couponCode || null,
//         rto: rto || false,
//         phone,
//         country,
//         state,
//         city,
//         address,
//         pincode,
//       };

//       Order.createOrder(orderData, items, (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res
//           .status(201)
//           .json({ message: "Order placed", orderId: result.orderId });
//       });
//     }
//   );
// };

// exports.getAllOrders = (req, res) => {
//   Order.getAllOrders((err, orders) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(orders);
//   });
// };

// exports.getOrderById = (req, res) => {
//   Order.getOrderById(req.params.id, (err, order) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (!order) return res.status(404).json({ error: "Order not found" });
//     res.json(order);
//   });
// };

// exports.updateOrderStatus = (req, res) => {
//   Order.updateOrderStatus(req.params.id, req.body.status, (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Order status updated" });
//   });
// };

// exports.deleteOrder = (req, res) => {
//   Order.deleteOrder(req.params.id, (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Order deleted" });
//   });
// };

// exports.getUserOrdersPaginated = (req, res) => {
//   const userId = req.user.id; // From your auth middleware
//   const page = parseInt(req.query.page) || 1; // Default page 1
//   const limit = parseInt(req.query.limit) || 10; // Default 10 orders
//   const offset = (page - 1) * limit;

//   Order.getUserOrdersCount(userId, (err, totalOrders) => {
//     if (err) return res.status(500).json({ error: err.message });

//     Order.getOrdersByUserPaginated(userId, limit, offset, (err, orders) => {
//       if (err) return res.status(500).json({ error: err.message });

//       const totalPages = Math.ceil(totalOrders / limit);

//       res.json({
//         success: true,
//         page,
//         limit,
//         totalOrders,
//         totalPages,
//         orders,
//       });
//     });
//   });
// };

const db = require("../config/db");
const Order = require("../models/orderModel");

// Create Order Controller
// exports.createOrder = (req, res) => {
//   const {
//     totalAmount,
//     paymentMethod,
//     paymentStatus,
//     items,
//     totalDiscountAmount,
//     shippingCharge,
//     couponCode,
//     discountAmount,
//     rto,
//     phone,
//     country,
//     state,
//     city,
//     address,
//     pincode,
//   } = req.body;

//   const userId = req.user.id;

//   if (!totalAmount || !items || !Array.isArray(items) || items.length === 0) {
//     return res.status(400).json({ error: "Missing or invalid fields" });
//   }

//   db.query(
//     "SELECT name, email FROM users WHERE id = ?",
//     [userId],
//     (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!results.length)
//         return res.status(404).json({ error: "User not found" });

//       const { name, email } = results[0];

//       const orderData = {
//         userId,
//         name,
//         email,
//         totalAmount,
//         paymentMethod: paymentMethod || "COD",
//         paymentStatus: paymentStatus || "pending",
//         orderStatus: 0, // Pending
//         totalDiscountAmount: totalDiscountAmount || 0,
//         shippingCharge: shippingCharge || 0,
//         couponCode: couponCode || null,
//         discountAmount: discountAmount || 0,
//         rto: rto || false,
//         phone,
//         country,
//         state,
//         city,
//         address,
//         pincode,
//       };

//       // Create order
//       Order.createOrder(orderData, items, async (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });

//         // ✅ After creating order, mark coupon as used if applicable
//         if (couponCode) {
//           const updateCouponQuery = `
//             UPDATE user_coupons uc
//             INNER JOIN coupons c ON uc.couponId = c.id
//             SET uc.isUsed = 1
//             WHERE uc.userId = ? AND c.code = ? AND uc.isUsed = 0
//           `;
//           db.query(
//             updateCouponQuery,
//             [userId, couponCode],
//             (couponErr, couponRes) => {
//               if (couponErr) {
//                 console.error(
//                   "Failed to mark coupon as used:",
//                   couponErr.message
//                 );
//                 // We will not fail the order if coupon update fails
//               }
//             }
//           );
//         }

//         res.status(201).json({
//           success: true,
//           message: "🎉 Order placed successfully!",
//           orderId: result.orderId,
//         });
//       });
//     }
//   );
// };

exports.createOrder = async (req, res) => {
  const {
    totalAmount,
    paymentMethod,
    paymentStatus,
    items,
    totalDiscountAmount,
    shippingCharge,
    couponCode,
    discountAmount,
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

  try {
    // Step 1: Get user info
    const [users] = await db.query(
      "SELECT name, email FROM users WHERE id = ?",
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const { name, email } = users[0];

    // Step 2: Prepare order data
    const orderData = {
      userId,
      name,
      email,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentStatus || "pending",
      orderStatus: 0,
      totalDiscountAmount: totalDiscountAmount || 0,
      shippingCharge: shippingCharge || 0,
      couponCode: couponCode || null,
      discountAmount: discountAmount || 0,
      rto: rto || false,
      phone,
      country,
      state,
      city,
      address,
      pincode,
    };

    // Step 3: Create order using orderModel
    Order.createOrder(orderData, items, async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Step 4: Mark coupon as used if applicable
      if (couponCode) {
        try {
          const updateCouponQuery = `
            UPDATE user_coupons uc
            INNER JOIN coupons c ON uc.couponId = c.id
            SET uc.isUsed = 1
            WHERE uc.userId = ? AND c.code = ? AND uc.isUsed = 0
          `;
          await db.query(updateCouponQuery, [userId, couponCode]);
        } catch (couponErr) {
          console.error("⚠️ Failed to mark coupon as used:", couponErr.message);
          // continue without failing the order
        }
      }

      // Step 5: Respond success
      res.status(201).json({
        success: true,
        message: "🎉 Order placed successfully!",
        orderId: result.orderId,
      });
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch All Orders
exports.getAllOrders = (req, res) => {
  Order.getAllOrders((err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(orders);
  });
};

// Get Order by ID
exports.getOrderById = (req, res) => {
  Order.getOrderById(req.params.id, (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });
};

// Update Order Status
exports.updateOrderStatus = (req, res) => {
  Order.updateOrderStatus(req.params.id, req.body.status, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order status updated successfully" });
  });
};

// Delete Order
exports.deleteOrder = (req, res) => {
  Order.deleteOrder(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order deleted successfully" });
  });
};

// Get Paginated User Orders
exports.getUserOrders = (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  Order.getUserOrdersCount(userId, (err, totalOrders) => {
    if (err) return res.status(500).json({ error: err.message });

    Order.getOrdersByUser(userId, limit, offset, (err, orders) => {
      if (err) return res.status(500).json({ error: err.message });

      const totalPages = Math.ceil(totalOrders / limit);

      res.json({
        success: true,
        page,
        limit,
        totalOrders,
        totalPages,
        orders,
      });
    });
  });
};
