const db = require("../config/db");

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
    rto,
    phone,
    country,
    state,
    city,
    address,
    pincode,
  } = orderData;

  db.query(
    `INSERT INTO order_logs 
    (userId, name, email, totalAmount, paymentMethod, paymentStatus, orderStatus, logType, totalDiscountAmount, shippingCharge, couponCode, rto) 
    VALUES (?, ?, ?, ?, ?, ?, ?, 'create', ?, ?, ?, ?)`,
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

      db.query(
        `INSERT INTO order_item_logs (orderId, productId, quantity, price) VALUES ?`,
        [orderItemsLogsValues],
        (err) => {
          if (err) return callback(err);

          // 3️⃣ Now insert into main orders table
          db.query(
            `INSERT INTO orders 
   (userId, name, email, totalAmount, paymentMethod, paymentStatus, orderStatus, totalDiscountAmount, shippingCharge, couponCode, rto, phone, country, state, city, address, pincode) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
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
              rto,
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

                  // ✅ Done — send orderId back
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

exports.getAllOrders = (callback) => {
  db.query("SELECT * FROM orders ORDER BY createdAt DESC", callback);
};

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

exports.updateOrderStatus = (id, status, callback) => {
  db.query(
    "UPDATE orders SET orderStatus = ? WHERE id = ?",
    [status, id],
    callback
  );
};

exports.deleteOrder = (id, callback) => {
  db.query("DELETE FROM orders WHERE id = ?", [id], callback);
};
