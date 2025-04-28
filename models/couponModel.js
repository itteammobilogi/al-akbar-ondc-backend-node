// Already exists:
// exports.rewardCouponToUser

const db = require("../config/db");

exports.createCoupon = (couponData) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    usageLimit,
    validFrom,
    validTill,
  } = couponData;

  return new Promise((resolve, reject) => {
    const query = `
        INSERT INTO coupons (code, discountType, discountValue, minOrderAmount, usageLimit, validFrom, validTill)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
    db.query(
      query,
      [
        code,
        discountType,
        discountValue,
        minOrderAmount,
        usageLimit,
        validFrom,
        validTill,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.editCoupon = (couponId, couponData) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    usageLimit,
    validFrom,
    validTill,
  } = couponData;

  return new Promise((resolve, reject) => {
    const query = `
        UPDATE coupons SET 
          code = ?, 
          discountType = ?, 
          discountValue = ?, 
          minOrderAmount = ?, 
          usageLimit = ?, 
          validFrom = ?, 
          validTill = ?
        WHERE id = ?
      `;
    db.query(
      query,
      [
        code,
        discountType,
        discountValue,
        minOrderAmount,
        usageLimit,
        validFrom,
        validTill,
        couponId,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.deleteCoupon = (couponId) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM coupons WHERE id = ?";
    db.query(query, [couponId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Fetch user's active coupons
// exports.getUserCoupons = (userId) => {
//   return new Promise((resolve, reject) => {
//     const query = `
//       SELECT uc.*, c.code, c.discountType, c.discountValue, c.minOrderAmount
//       FROM user_coupons uc
//       JOIN coupons c ON uc.couponId = c.id
//       WHERE uc.userId = ? AND uc.isUsed = FALSE
//       AND (uc.expiresAt IS NULL OR uc.expiresAt > NOW())
//     `;
//     db.query(query, [userId], (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// };

// Validate if a coupon can be used
// exports.validateUserCoupon = (userId, couponCode, cartTotal) => {
//   return new Promise((resolve, reject) => {
//     const query = `
//       SELECT uc.*, c.discountType, c.discountValue, c.minOrderAmount
//       FROM user_coupons uc
//       JOIN coupons c ON uc.couponId = c.id
//       WHERE uc.userId = ? AND c.code = ? AND uc.isUsed = FALSE
//       AND (uc.expiresAt IS NULL OR uc.expiresAt > NOW())
//       LIMIT 1
//     `;
//     db.query(query, [userId, couponCode], (err, results) => {
//       if (err) return reject(err);
//       if (results.length === 0)
//         return reject(new Error("Invalid or expired coupon"));

//       const coupon = results[0];

//       // Check if cartTotal meets minimum requirement
//       if (cartTotal < coupon.minOrderAmount) {
//         return reject(
//           new Error(
//             `Minimum order amount ₹${coupon.minOrderAmount} required to apply this coupon`
//           )
//         );
//       }

//       resolve(coupon);
//     });
//   });
// };
exports.getUserCoupons = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT uc.isUsed, uc.expiresAt, c.code, c.discountType, c.discountValue, c.minOrderAmount, c.validTill
      FROM user_coupons uc
      JOIN coupons c ON uc.couponId = c.id
      WHERE uc.userId = ?
      AND (uc.expiresAt IS NULL OR uc.expiresAt > NOW())
    `;
    db.query(query, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.validateUserCoupon = (userId, couponCode, cartTotal) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT uc.*, c.discountType, c.discountValue, c.minOrderAmount
      FROM user_coupons uc
      JOIN coupons c ON uc.couponId = c.id
      WHERE uc.userId = ? AND c.code = ?
      AND (uc.expiresAt IS NULL OR uc.expiresAt > NOW())
      LIMIT 1
    `;

    db.query(query, [userId, couponCode], (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) {
        return reject(new Error("Invalid or expired coupon"));
      }

      const coupon = results[0];

      if (coupon.isUsed) {
        return reject(new Error("You have already used this coupon"));
      }

      // Check if cartTotal meets minimum requirement
      if (cartTotal < coupon.minOrderAmount) {
        return reject(
          new Error(
            `Minimum order amount ₹${coupon.minOrderAmount} required to apply this coupon`
          )
        );
      }

      resolve(coupon);
    });
  });
};

exports.rewardCouponToUser = (userId, couponCode) => {
  return new Promise((resolve, reject) => {
    // Step 1: Find the coupon from master coupons
    const couponQuery = `
        SELECT * FROM coupons 
        WHERE code = ? 
        AND validFrom <= NOW() 
        AND (validTill IS NULL OR validTill >= NOW())
        LIMIT 1
      `;

    db.query(couponQuery, [couponCode], (err, coupons) => {
      if (err) return reject(err);
      if (coupons.length === 0) {
        return reject(new Error("Coupon not found or expired"));
      }

      const coupon = coupons[0];

      // Step 2: Check if the user already earned this coupon
      const userCouponCheckQuery = `
          SELECT * FROM user_coupons 
          WHERE userId = ? AND couponId = ?
        `;

      db.query(
        userCouponCheckQuery,
        [userId, coupon.id],
        (err, userCoupons) => {
          if (err) return reject(err);
          if (userCoupons.length > 0) {
            return reject(new Error("User already earned this coupon"));
          }

          // Step 3: Insert into user_coupons
          const expiresAt =
            coupon.validTill || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days if no validTill

          const insertQuery = `
            INSERT INTO user_coupons (userId, couponId, expiresAt) 
            VALUES (?, ?, ?)
          `;

          db.query(
            insertQuery,
            [userId, coupon.id, expiresAt],
            (err, result) => {
              if (err) return reject(err);
              resolve({ message: "Coupon rewarded successfully", coupon });
            }
          );
        }
      );
    });
  });
};
