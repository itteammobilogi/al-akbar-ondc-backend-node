// ── payment.controller.js ──
require("dotenv").config(); // 1️⃣ ensure this is at top
const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../config/db");
const { sendEmail, sendSMS } = require("../utils/notify");

// // 2️⃣ debug env
// console.log("⚙️  RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
// console.log("⚙️  RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
// console.log(
//   "⚙️  RAZORPAY_WEBHOOK_SECRET:",
//   process.env.RAZORPAY_WEBHOOK_SECRET
// );

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===============================
// @desc    Create Razorpay order
// @route   POST /api/payment/razorpay/order
// exports.createRazorpayOrder = async (req, res) => {
//   console.log("▶️ Hit /razorpay/order, payload:", req.body);

//   const userId = req.user?.id || null;
//   const {
//     amount, // in rupees, as sent by client
//     currency = "INR",
//     receipt = `receipt_${Date.now()}`,
//     totalDiscountAmount = 0,
//     shippingCharge = 0,
//     couponCode = "",
//   } = req.body;

//   // Validate and convert amount
//   const rupees = parseFloat(amount);
//   if (isNaN(rupees) || rupees <= 0) {
//     return res.status(400).json({ error: "Invalid or missing amount" });
//   }
//   const paise = Math.round(rupees * 100); // must be integer

//   const options = {
//     amount: paise,
//     currency,
//     receipt,
//     payment_capture: 1,
//     notes: {
//       userId,
//       discount: totalDiscountAmount,
//       shipping: shippingCharge,
//       coupon: couponCode,
//     },
//   };

//   try {
//     // 1️⃣ Create the order with Razorpay
//     const order = await razorpay.orders.create(options);
//     console.log("✅ Razorpay order created:", order);

//     // 2️⃣ Prepare values for DB logging
//     const values = [
//       order.id,
//       order.amount,
//       order.currency,
//       order.receipt,
//       order.status,
//       userId,
//       totalDiscountAmount,
//       shippingCharge,
//       couponCode,
//     ];

//     // 3️⃣ Log to razorpay_order_logs
//     const logSql = `
//       INSERT INTO razorpay_order_logs
//         (razorpayOrderId, amount, currency, receipt, status,
//          userId, discount, shipping, couponCode, logType)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'create')
//     `;
//     db.query(logSql, values, (logErr) => {
//       if (logErr) {
//         console.error("❌ Log insert error:", logErr);
//         return res.status(500).json({ error: "Failed to log order" });
//       }

//       // 4️⃣ Save to razorpay_orders
//       const orderSql = `
//         INSERT INTO razorpay_orders
//           (razorpayOrderId, amount, currency, receipt, status,
//            userId, discount, shipping, couponCode)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;
//       db.query(orderSql, values, (orderErr) => {
//         if (orderErr) {
//           console.error("❌ Main table insert error:", orderErr);
//           return res
//             .status(500)
//             .json({ error: "Failed to save Razorpay order" });
//         }
//         // 5️⃣ Respond with the created order
//         return res
//           .status(201)
//           .json({ message: "Razorpay order created", order });
//       });
//     });
//   } catch (err) {
//     console.error("🔥 Razorpay order error:", err);
//     const msg =
//       err.error?.description || err.message || "Order creation failed";
//     return res.status(500).json({ error: msg });
//   }
// };

exports.createRazorpayOrder = async (req, res) => {
  const userId = req.user?.id || null;
  const {
    amount,
    currency = "INR",
    receipt = `receipt_${Date.now()}`,
    totalDiscountAmount = 0,
    shippingCharge = 0,
    couponCode = "",
  } = req.body;

  const rupees = parseFloat(amount);
  if (isNaN(rupees) || rupees <= 0) {
    return res.status(400).json({ error: "Invalid or missing amount" });
  }

  const paise = Math.round(rupees * 100);

  const options = {
    amount: paise,
    currency,
    receipt,
    payment_capture: 1,
    notes: {
      userId,
      discount: totalDiscountAmount,
      shipping: shippingCharge,
      coupon: couponCode,
    },
  };

  try {
    const order = await razorpay.orders.create(options);

    const values = [
      order.id,
      order.amount,
      order.currency,
      order.receipt,
      order.status,
      userId,
      totalDiscountAmount,
      shippingCharge,
      couponCode,
    ];

    await db.query(
      `
      INSERT INTO razorpay_order_logs
      (razorpayOrderId, amount, currency, receipt, status, userId, discount, shipping, couponCode, logType)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'create')`,
      values
    );

    await db.query(
      `
      INSERT INTO razorpay_orders
      (razorpayOrderId, amount, currency, receipt, status, userId, discount, shipping, couponCode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    return res.status(201).json({ message: "Razorpay order created", order });
  } catch (err) {
    console.error("🔥 Razorpay order error:", err);
    return res
      .status(500)
      .json({ error: err.error?.description || err.message });
  }
};

// ===============================
// @desc    Verify Razorpay Signature
// @route   POST /api/payment/razorpay/verify
// ===============================

// exports.verifyRazorpaySignature = (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     transaction_status = "success", // default assuming payment went through
//     transaction_amount,
//     orderId,
//     items_json,
//   } = req.body;

//   const userId = req.user?.id; // Ensure middleware added user to request
//   const secret = process.env.RAZORPAY_KEY_SECRET;
//   console.log("🔑 Verifying with secret:", !!secret);

//   const generated = crypto
//     .createHmac("sha256", secret)
//     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//     .digest("hex");

//   if (generated === razorpay_signature) {
//     const sql = `
//       INSERT INTO tbl_payment
//         (userId, razorpay_order_id, razorpay_payment_id, razorpay_signature, transaction_status, transaction_amount, orderId, items_json)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       userId,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       transaction_status,
//       transaction_amount,
//       orderId,
//       JSON.stringify(items_json || []),
//     ];

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error(" Payment insert failed:", err);
//         return res
//           .status(500)
//           .json({ success: false, error: "DB insert error" });
//       }

//       console.log(" Payment recorded:", result.insertId);
//       return res
//         .status(200)
//         .json({ success: true, message: "Payment verified and stored" });
//     });
//   } else {
//     return res.status(400).json({ success: false, error: "Invalid signature" });
//   }
// };

exports.verifyRazorpaySignature = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    transaction_status = "success",
    transaction_amount,
    orderId,
    items_json,
  } = req.body;

  const userId = req.user?.id;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  const generated = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated !== razorpay_signature) {
    return res.status(400).json({ success: false, error: "Invalid signature" });
  }

  try {
    const [result] = await db.query(
      `
      INSERT INTO tbl_payment
      (userId, razorpay_order_id, razorpay_payment_id, razorpay_signature, transaction_status, transaction_amount, orderId, items_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        transaction_status,
        transaction_amount,
        orderId,
        JSON.stringify(items_json || []),
      ]
    );

    console.log("✅ Payment recorded:", result.insertId);
    return res
      .status(200)
      .json({ success: true, message: "Payment verified and stored" });
  } catch (err) {
    console.error("❌ DB insert failed:", err);
    return res.status(500).json({ success: false, error: "DB insert error" });
  }
};

// exports.handleWebhook = (req, res) => {
//   const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
//   const signature = req.headers["x-razorpay-signature"];
//   const rawBody = req.body; // express.raw() is already applied in app.js

//   const expectedSignature = crypto
//     .createHmac("sha256", secret)
//     .update(JSON.stringify(rawBody))
//     .digest("hex");

//   if (signature !== expectedSignature) {
//     console.error("❌ Invalid webhook signature");
//     return res.status(400).json({ success: false, error: "Invalid signature" });
//   }

//   const event = rawBody.event;
//   const entity =
//     rawBody.payload?.payment?.entity ||
//     rawBody.payload?.order?.entity ||
//     rawBody.payload?.refund?.entity;

//   console.log("📩 Webhook event:", event);

//   // Insert into razorpay_webhook_logs
//   const sql = `
//     INSERT INTO razorpay_webhook_logs
//       (userId, payment_id, razorpay_order_id, orderId, amount, currency, status, full_payload)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const values = [
//     null, // userId (you can map later using your internal logic)
//     entity.id || null,
//     entity.order_id || null,
//     null, // orderId from your app if you have a mapping
//     entity.amount || 0,
//     entity.currency || "INR",
//     entity.status || "unknown",
//     JSON.stringify(rawBody),
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("❌ Webhook DB insert error:", err);
//       return res.status(500).json({ error: "DB insert error" });
//     }

//     console.log(`Webhook event ${event} logged`);

//     // Optional: Update your orders table
//     if (event === "payment.captured") {
//       const payment = payload.payment.entity;

//       // Example: Get user email/phone from DB (pseudo query)
//       const q = `SELECT email, phone, name FROM users WHERE id = ? LIMIT 1`;
//       db.query(q, [userId], async (err, rows) => {
//         if (err) return console.error("User fetch failed", err);
//         if (!rows.length) return;

//         const user = rows[0];

//         // ✅ Email content
//         const subject = "Payment Successful!";
//         const html = `
//           <h2>Hi ${user.name},</h2>
//           <p>Your payment of ₹${payment.amount / 100} was successful.</p>
//           <p>Payment ID: ${payment.id}</p>
//         `;

//         // ✅ SMS content
//         const smsText = `Hi ${user.name}, your payment of ₹${
//           payment.amount / 100
//         } was successful. Payment ID: ${payment.id}`;

//         try {
//           await sendEmail(user.email, subject, html);
//           await sendSMS(user.phone, smsText);
//           console.log("✅ Email and SMS sent");
//         } catch (notifyErr) {
//           console.error("❌ Notification error:", notifyErr);
//         }
//       });
//     }

//     if (event === "refund.created") {
//       const updateSql = `
//         UPDATE orders SET status = 'refunded'
//         WHERE razorpay_order_id = ?
//       `;
//       db.query(updateSql, [entity.order_id]);
//     }

//     return res.status(200).json({ success: true });
//   });
// };

// ===============================
// @desc    Handle COD Orders
// @route   POST /api/payment/cod
// ===============================

exports.handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const bodyBuf = req.body; // raw Buffer from express.raw()

  // Debug: log headers and first bytes of body
  console.log("🔥 Headers Received:", req.headers);
  console.log("🔥 Body Buffer (first 100 bytes):", bodyBuf.slice(0, 100));

  // Compute expected HMAC using raw buffer
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(bodyBuf)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("❌ Invalid webhook signature");
    console.log("Received Signature:", signature);
    console.log("Expected Signature:", expectedSignature);
    return res.status(400).json({ success: false, error: "Invalid signature" });
  }

  // Parse the JSON once signature is verified
  let payload;
  try {
    payload = JSON.parse(bodyBuf.toString("utf8"));
  } catch (err) {
    console.error("❌ Error parsing JSON:", err);
    return res.status(400).json({ success: false, error: "Invalid JSON" });
  }

  const event = payload.event;
  console.log(`📥 Event: ${event}`);

  const entity =
    payload.payload?.payment?.entity ||
    payload.payload?.order?.entity ||
    payload.payload?.refund?.entity;

  const internalOrderId = entity?.notes?.orderId || null;
  const userId = entity?.notes?.userId || null;

  try {
    // 1. Log to your webhook table
    await db.query(
      `INSERT INTO razorpay_webhook_logs
         (userId, payment_id, razorpay_order_id, orderId, amount, currency, status, full_payload)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        entity.id,
        entity.order_id,
        internalOrderId,
        entity.amount,
        entity.currency,
        entity.status,
        JSON.stringify(payload),
      ]
    );

    // 2. Handle specific events
    switch (event) {
      case "payment.captured":
        if (internalOrderId) {
          await db.query(
            `UPDATE orders
               SET paymentStatus = 'paid',
                   razorpay_payment_id = ?
             WHERE id = ?`,
            [entity.id, internalOrderId]
          );
          console.log(`✅ Order ${internalOrderId} marked as PAID`);
        }
        if (userId) {
          const [rows] = await db.query(
            `SELECT email, phone, name FROM users WHERE id = ?`,
            [userId]
          );
          if (rows.length) {
            const user = rows[0];
            await sendEmail(
              user.email,
              "Payment Successful!",
              `<p>Hi ${user.name}, your payment of ₹${
                entity.amount / 100
              } was successful.</p>`
            );
            await sendSMS(
              user.phone,
              `Hi ${user.name}, your payment of ₹${
                entity.amount / 100
              } was successful.`
            );
            console.log("📧 Notification sent to user");
          }
        }
        break;

      case "payment.failed":
        if (entity.order_id) {
          await db.query(
            `UPDATE orders SET paymentStatus = 'failed' WHERE razorpay_order_id = ?`,
            [entity.order_id]
          );
          console.warn(`⚠️ Payment failed for Order ${entity.order_id}`);
        }
        break;

      case "payment.authorized":
        if (entity.order_id) {
          await db.query(
            `UPDATE orders SET paymentStatus = 'authorized' WHERE razorpay_order_id = ?`,
            [entity.order_id]
          );
          console.log(`🕒 Payment authorized for Order ${entity.order_id}`);
        }
        break;

      case "refund.created":
        if (entity.order_id) {
          await db.query(
            `UPDATE orders SET paymentStatus = 'refunded' WHERE razorpay_order_id = ?`,
            [entity.order_id]
          );
          console.log(`🔁 Refund processed for Order ${entity.order_id}`);
        }
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event}`);
    }

    console.log("✅ Webhook processed successfully");
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook handling error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

exports.handleCOD = (req, res) => {
  return res
    .status(200)
    .json({ message: "Order placed with Cash on Delivery" });
};

// https://heavy-sites-leave.loca.lt/api/payment/razorpay/webhook
