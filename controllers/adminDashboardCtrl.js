const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders");
    const [users] = await db.query("SELECT * FROM users WHERE role = 'user'");

    const [coupons] = await db.query(
      "SELECT COUNT(*) AS used FROM orders WHERE couponCode IS NOT NULL"
    );

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, o) => sum + parseFloat(o.totalAmount || 0),
      0
    );
    const pendingOrders = orders.filter((o) => o.orderStatus == 0).length;
    const deliveredOrders = orders.filter((o) => o.orderStatus == 3).length;
    const totalCustomers = users.length;
    const couponsUsed = coupons[0]?.used || 0;

    // Optional: Simple conversion rate (if you track sessions/leads)
    const totalSessions = 1000; // Replace with real tracked sessions if available
    const conversionRate =
      totalSessions > 0 ? ((totalOrders / totalSessions) * 100).toFixed(2) : 0;

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      totalCustomers,
      couponsUsed,
      conversionRate,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};
