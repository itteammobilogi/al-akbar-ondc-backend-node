const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoute");
const categoryRoutes = require("./routes/categoryRoute");
const brandRoutes = require("./routes/brandRoute");
const orderRoutes = require("./routes/orderRoute");
const paymentRoutes = require("./routes/paymentRoute");
const cartRoutes = require("./routes/cartRoute");
const wishlistRoutes = require("./routes/wishListRoute");
const couponRoutes = require("./routes/couponRoute");
const contactUsRoutes = require("./routes/contactusRoute");
const path = require("path");
// const cron = require("node-cron");
// const { rewardBirthdayCoupons } = require("./cronj/birthdayCoupon");

dotenv.config();

const app = express();
const corsOption = {
  // origin: ["http://ondcapi.elloweb.com"],
  origin: ["http://localhost:3000"],
  credentials: true,
};

// app.use(
//   "/api/payment/razorpay/webhook",
//   express.raw({ type: "application/json" })
// );
app.use(express.json());
app.use(cors(corsOption));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/api", (req, res, next) => {
//   console.log(`📣 [${req.method}] ${req.originalUrl}`, "body:", req.body);
//   next();
// });

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contactus", contactUsRoutes);
app.use("/api/products/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("E-commerce Backend Running");
});

// cron.schedule("0 0 * * *", () => {
//   console.log("🔔 Running Birthday Coupon Cron Job...");
//   rewardBirthdayCoupons();
// });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
