// const db = require("../config/db");

// exports.createOrder = (orderData, items, callback) => {
//   const {
//     userId,
//     name,
//     email,
//     totalAmount,
//     paymentMethod,
//     paymentStatus,
//     orderStatus,
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
//   } = orderData;

//   db.query(
//     `INSERT INTO order_logs
//     (userId, name, email, totalAmount, paymentMethod, paymentStatus, orderStatus, logType, totalDiscountAmount, shippingCharge, couponCode, rto)
//     VALUES (?, ?, ?, ?, ?, ?, ?, 'create', ?, ?, ?, ?)`,
//     [
//       userId,
//       name,
//       email,
//       totalAmount,
//       paymentMethod,
//       paymentStatus,
//       orderStatus,
//       totalDiscountAmount || 0,
//       shippingCharge || 0,
//       couponCode || null,
//       rto || false,
//     ],
//     (err, logResult) => {
//       if (err) return callback(err);

//       const logOrderId = logResult.insertId;

//       const orderItemsLogsValues = items.map((item) => [
//         logOrderId,
//         item.productId,
//         item.quantity,
//         item.price,
//       ]);

//       db.query(
//         `INSERT INTO order_item_logs (orderId, productId, quantity, price) VALUES ?`,
//         [orderItemsLogsValues],
//         (err) => {
//           if (err) return callback(err);

//           // 3️⃣ Now insert into main orders table
//           db.query(
//             `INSERT INTO orders
//    (userId, name, email, totalAmount, paymentMethod, paymentStatus, orderStatus, totalDiscountAmount, shippingCharge, couponCode, rto, phone, country, state, city, address, pincode)
//    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//               userId,
//               name,
//               email,
//               totalAmount,
//               paymentMethod,
//               paymentStatus,
//               orderStatus,
//               totalDiscountAmount,
//               shippingCharge,
//               couponCode,
//               rto,
//               phone,
//               country,
//               state,
//               city,
//               address,
//               pincode,
//             ],
//             (err, orderResult) => {
//               if (err) return callback(err);

//               const orderId = orderResult.insertId;

//               const orderItemsValues = items.map((item) => [
//                 orderId,
//                 item.productId,
//                 item.quantity,
//                 item.price,
//               ]);

//               db.query(
//                 `INSERT INTO order_items (orderId, productId, quantity, price) VALUES ?`,
//                 [orderItemsValues],
//                 (err) => {
//                   if (err) return callback(err);

//                   // ✅ Done — send orderId back
//                   callback(null, { orderId });
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// };

// exports.getAllOrders = (callback) => {
//   db.query("SELECT * FROM orders ORDER BY createdAt DESC", callback);
// };

// exports.getOrderById = (id, callback) => {
//   db.query("SELECT * FROM orders WHERE id = ?", [id], (err, results) => {
//     if (err) return callback(err);
//     const order = results[0];
//     if (!order) return callback(null, null);

//     db.query(
//       "SELECT * FROM order_items WHERE orderId = ?",
//       [id],
//       (err, items) => {
//         if (err) return callback(err);
//         order.items = items;
//         callback(null, order);
//       }
//     );
//   });
// };

// exports.updateOrderStatus = (id, status, callback) => {
//   db.query(
//     "UPDATE orders SET orderStatus = ? WHERE id = ?",
//     [status, id],
//     callback
//   );
// };

// exports.deleteOrder = (id, callback) => {
//   db.query("DELETE FROM orders WHERE id = ?", [id], callback);
// };

// exports.getOrdersByUserPaginated = (userId, limit, offset, callback) => {
//   const query = `
//     SELECT * FROM orders
//     WHERE userId = ?
//     ORDER BY createdAt DESC
//     LIMIT ? OFFSET ?
//   `;

//   db.query(query, [userId, limit, offset], (err, results) => {
//     if (err) return callback(err);
//     callback(null, results);
//   });
// };

// // Get total count
// exports.getUserOrdersCount = (userId, callback) => {
//   const query = "SELECT COUNT(*) AS total FROM orders WHERE userId = ?";
//   db.query(query, [userId], (err, results) => {
//     if (err) return callback(err);
//     callback(null, results[0].total);
//   });
// };

const db = require("../config/db");

// Create a new order (full process)
exports.createOrder = (orderData, items, callback) => {
  const {
    userId,
    name,
    email,
    totalAmount,
    paymentMethod,
    paymentStatus,
    orderStatus,
    totalDiscountAmount,
    shippingCharge,
    couponCode,
    discountAmount, // new field
    rto,
    phone,
    country,
    state,
    city,
    address,
    pincode,
  } = orderData;

  // Step 1: Insert into order_logs
  db.query(
    `INSERT INTO order_logs 
    (userId, name, email, totalAmount, paymentMethod, paymentStatus, orderStatus, logType, totalDiscountAmount, shippingCharge, couponCode, discountAmount, rto) 
    VALUES (?, ?, ?, ?, ?, ?, ?, 'create', ?, ?, ?, ?, ?)`,
    [
      userId,
      name,
      email,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus,
      totalDiscountAmount || 0,
      shippingCharge || 0,
      couponCode || null,
      discountAmount || 0,
      rto || false,
    ],
    (err, logResult) => {
      if (err) return callback(err);

      const logOrderId = logResult.insertId;

      const orderItemsLogsValues = items.map((item) => [
        logOrderId,
        item.productId,
        item.quantity,
        item.price,
      ]);

      // Step 2: Insert order items logs
      db.query(
        `INSERT INTO order_item_logs (orderId, productId, quantity, price) VALUES ?`,
        [orderItemsLogsValues],
        (err) => {
          if (err) return callback(err);

          // Step 3: Insert into main orders table
          db.query(
            `INSERT INTO orders 
   (userId, name, email, totalAmount, paymentMethod, paymentStatus, orderStatus, totalDiscountAmount, shippingCharge, couponCode, discountAmount, rto, phone, country, state, city, address, pincode) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              name,
              email,
              totalAmount,
              paymentMethod,
              paymentStatus,
              orderStatus,
              totalDiscountAmount || 0,
              shippingCharge || 0,
              couponCode || null,
              discountAmount || 0,
              rto || false,
              phone,
              country,
              state,
              city,
              address,
              pincode,
            ],
            (err, orderResult) => {
              if (err) return callback(err);

              const orderId = orderResult.insertId;

              const orderItemsValues = items.map((item) => [
                orderId,
                item.productId,
                item.quantity,
                item.price,
              ]);

              db.query(
                `INSERT INTO order_items (orderId, productId, quantity, price) VALUES ?`,
                [orderItemsValues],
                (err) => {
                  if (err) return callback(err);

                  // ✅ DONE — return orderId
                  callback(null, { orderId });
                }
              );
            }
          );
        }
      );
    }
  );
};

// Fetch all orders
exports.getAllOrders = (callback) => {
  db.query("SELECT * FROM orders ORDER BY createdAt DESC", callback);
};

// Fetch single order by ID
exports.getOrderById = (id, callback) => {
  db.query("SELECT * FROM orders WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    const order = results[0];
    if (!order) return callback(null, null);

    db.query(
      "SELECT * FROM order_items WHERE orderId = ?",
      [id],
      (err, items) => {
        if (err) return callback(err);
        order.items = items;
        callback(null, order);
      }
    );
  });
};

// Update order status
exports.updateOrderStatus = (id, status, callback) => {
  db.query(
    "UPDATE orders SET orderStatus = ? WHERE id = ?",
    [status, id],
    callback
  );
};

// Delete an order
exports.deleteOrder = (id, callback) => {
  db.query("DELETE FROM orders WHERE id = ?", [id], callback);
};

// Paginate user's orders
exports.getOrdersByUser = (userId, limit, offset, callback) => {
  const query = `
    SELECT 
      o.id AS orderId, 
      o.totalAmount, 
      o.paymentMethod, 
      o.paymentStatus, 
      o.orderStatus,
      o.createdAt, 
      oi.productId, 
      p.name AS productName, 
      p.images AS productImages,
      oi.quantity, 
      oi.price AS productPrice
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.orderId
    LEFT JOIN products p ON oi.productId = p.id
    WHERE o.userId = ?
    ORDER BY o.createdAt DESC 
    LIMIT ? OFFSET ?
  `;

  db.query(query, [userId, limit, offset], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Get user's total order count
exports.getUserOrdersCount = (userId, callback) => {
  const query = "SELECT COUNT(*) AS total FROM orders WHERE userId = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0].total);
  });
};
