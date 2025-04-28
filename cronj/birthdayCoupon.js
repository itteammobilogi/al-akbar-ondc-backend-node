const db = require("../config/db");
const { rewardCouponToUser } = require("../models/couponModel");

const birthdayCouponCode = "BIRTHDAY2025"; // Your birthday coupon code

const rewardBirthdayCoupons = () => {
  const today = new Date();
  const todayMonth = today.getMonth() + 1; // JS months are 0-indexed
  const todayDate = today.getDate();

  const query = `
    SELECT id FROM users
    WHERE dob IS NOT NULL
    AND MONTH(dob) = ?
    AND DAY(dob) = ?
  `;

  db.query(query, [todayMonth, todayDate], async (err, users) => {
    if (err) {
      console.error("Birthday Query Error:", err);
      return;
    }

    if (users.length === 0) {
      console.log("🎂 No birthdays today");
      return;
    }

    console.log(`🎉 Found ${users.length} birthdays today`);

    for (const user of users) {
      try {
        await rewardCouponToUser(user.id, birthdayCouponCode);
        console.log(`✅ Birthday Coupon rewarded to userId: ${user.id}`);
      } catch (err) {
        console.error(`❌ Failed for userId ${user.id}:`, err.message);
      }
    }
  });
};

module.exports = { rewardBirthdayCoupons };
