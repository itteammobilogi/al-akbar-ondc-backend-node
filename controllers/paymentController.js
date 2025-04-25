// ── payment.controller.js ──
require("dotenv").config(); // 1️⃣ ensure this is at top
const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../config/db");
const { sendEmail, sendSMS } = require("../utils/notify");

// 2️⃣ debug env
console.log("⚙️  RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("⚙️  RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
console.log(
  "⚙️  RAZORPAY_WEBHOOK_SECRET:",
  process.env.RAZORPAY_WEBHOOK_SECRET
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===============================
// @desc    Create Razorpay order
// @route   POST /api/payment/razorpay/order
exports.createRazorpayOrder = async (req, res) => {
  console.log("▶️ Hit /razorpay/order, payload:", req.body);

  const userId = req.user?.id || null;
  const {
    amount, // in rupees, as sent by client
    currency = "INR",
    receipt = `receipt_${Date.now()}`,
    totalDiscountAmount = 0,
    shippingCharge = 0,
    couponCode = "",
  } = req.body;

  // Validate and convert amount
  const rupees = parseFloat(amount);
  if (isNaN(rupees) || rupees <= 0) {
    return res.status(400).json({ error: "Invalid or missing amount" });
  }
  const paise = Math.round(rupees * 100); // must be integer

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
    // 1️⃣ Create the order with Razorpay
    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", order);

    // 2️⃣ Prepare values for DB logging
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

    // 3️⃣ Log to razorpay_order_logs
    const logSql = `
      INSERT INTO razorpay_order_logs
        (razorpayOrderId, amount, currency, receipt, status,
         userId, discount, shipping, couponCode, logType)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'create')
    `;
    db.query(logSql, values, (logErr) => {
      if (logErr) {
        console.error("❌ Log insert error:", logErr);
        return res.status(500).json({ error: "Failed to log order" });
      }

      // 4️⃣ Save to razorpay_orders
      const orderSql = `
        INSERT INTO razorpay_orders
          (razorpayOrderId, amount, currency, receipt, status,
           userId, discount, shipping, couponCode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(orderSql, values, (orderErr) => {
        if (orderErr) {
          console.error("❌ Main table insert error:", orderErr);
          return res
            .status(500)
            .json({ error: "Failed to save Razorpay order" });
        }
        // 5️⃣ Respond with the created order
        return res
          .status(201)
          .json({ message: "Razorpay order created", order });
      });
    });
  } catch (err) {
    console.error("🔥 Razorpay order error:", err);
    const msg =
      err.error?.description || err.message || "Order creation failed";
    return res.status(500).json({ error: msg });
  }
};

// ===============================
// @desc    Verify Razorpay Signature
// @route   POST /api/payment/razorpay/verify
// ===============================

exports.verifyRazorpaySignature = (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    transaction_status = "success", // default assuming payment went through
    transaction_amount,
    orderId,
    items_json,
  } = req.body;

  const userId = req.user?.id; // Ensure middleware added user to request
  const secret = process.env.RAZORPAY_KEY_SECRET;
  console.log("🔑 Verifying with secret:", !!secret);

  const generated = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated === razorpay_signature) {
    const sql = `
      INSERT INTO tbl_payment 
        (userId, razorpay_order_id, razorpay_payment_id, razorpay_signature, transaction_status, transaction_amount, orderId, items_json) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transaction_status,
      transaction_amount,
      orderId,
      JSON.stringify(items_json || []),
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(" Payment insert failed:", err);
        return res
          .status(500)
          .json({ success: false, error: "DB insert error" });
      }

      console.log(" Payment recorded:", result.insertId);
      return res
        .status(200)
        .json({ success: true, message: "Payment verified and stored" });
    });
  } else {
    return res.status(400).json({ success: false, error: "Invalid signature" });
  }
};

exports.handleWebhook = (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.body; // express.raw() is already applied in app.js

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(rawBody))
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("❌ Invalid webhook signature");
    return res.status(400).json({ success: false, error: "Invalid signature" });
  }

  const event = rawBody.event;
  const entity =
    rawBody.payload?.payment?.entity ||
    rawBody.payload?.order?.entity ||
    rawBody.payload?.refund?.entity;

  console.log("📩 Webhook event:", event);

  // Insert into razorpay_webhook_logs
  const sql = `
    INSERT INTO razorpay_webhook_logs
      (userId, payment_id, razorpay_order_id, orderId, amount, currency, status, full_payload)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    null, // userId (you can map later using your internal logic)
    entity.id || null,
    entity.order_id || null,
    null, // orderId from your app if you have a mapping
    entity.amount || 0,
    entity.currency || "INR",
    entity.status || "unknown",
    JSON.stringify(rawBody),
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Webhook DB insert error:", err);
      return res.status(500).json({ error: "DB insert error" });
    }

    console.log(`Webhook event ${event} logged`);

    // Optional: Update your orders table
    if (event === "payment.captured") {
      const payment = payload.payment.entity;

      // Example: Get user email/phone from DB (pseudo query)
      const q = `SELECT email, phone, name FROM users WHERE id = ? LIMIT 1`;
      db.query(q, [userId], async (err, rows) => {
        if (err) return console.error("User fetch failed", err);
        if (!rows.length) return;

        const user = rows[0];

        // ✅ Email content
        const subject = "Payment Successful!";
        const html = `
          <h2>Hi ${user.name},</h2>
          <p>Your payment of ₹${payment.amount / 100} was successful.</p>
          <p>Payment ID: ${payment.id}</p>
        `;

        // ✅ SMS content
        const smsText = `Hi ${user.name}, your payment of ₹${
          payment.amount / 100
        } was successful. Payment ID: ${payment.id}`;

        try {
          await sendEmail(user.email, subject, html);
          await sendSMS(user.phone, smsText);
          console.log("✅ Email and SMS sent");
        } catch (notifyErr) {
          console.error("❌ Notification error:", notifyErr);
        }
      });
    }

    if (event === "refund.created") {
      const updateSql = `
        UPDATE orders SET status = 'refunded'
        WHERE razorpay_order_id = ?
      `;
      db.query(updateSql, [entity.order_id]);
    }

    return res.status(200).json({ success: true });
  });
};
// ===============================
// @desc    Handle COD Orders
// @route   POST /api/payment/cod
// ===============================
exports.handleCOD = (req, res) => {
  return res
    .status(200)
    .json({ message: "Order placed with Cash on Delivery" });
};

// https://heavy-sites-leave.loca.lt/api/payment/razorpay/webhook
