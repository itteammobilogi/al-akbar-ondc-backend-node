// helpers/emailTemplates.js

const generateOrderStatusEmail = (userName, status, productNames) => {
  return `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f6f7fb; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background-color: #d63384; padding: 20px; text-align: center;">
        <img src="https://lsmedia.linker-cdn.net/275228/2021/5456322.jpeg" alt="Al-Akbar" style="height: 60px;" />
      </div>

      <!-- Body -->
      <div style="padding: 30px;">
        <h2 style="color: #333;">Hello ${userName},</h2>
        <p style="font-size: 15px; color: #555;">
          Thank you for shopping with <strong>Al-Akbar</strong> — where tradition meets elegance.
        </p>
        <p style="font-size: 15px; color: #555;">
          The following product(s) in your order have been updated:
          <strong style="color:#d63384;"> ${productNames}</strong>
        </p>

        <div style="margin: 30px 0; background-color: #f1f1f1; padding: 20px; border-left: 5px solid #d63384;">
          <h3 style="margin: 0; color: #d63384;">🧾 Order Status Update</h3>
          <p style="margin: 10px 0 0; font-size: 16px; color: #444;">
            Your order status is now: <strong style="text-transform: capitalize;">${status}</strong>
          </p>
        </div>

        <p style="font-size: 14px; color: #444; margin-top: 30px;">
          Warm regards,<br />
          <strong>The Al-Akbar Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #333; color: #ccc; padding: 20px; text-align: center; font-size: 13px;">
        Follow us on 
        <a href="#" style="color: #f8d7da; text-decoration: none;">Instagram</a> | 
        <a href="#" style="color: #f8d7da; text-decoration: none;">Facebook</a><br />
        © ${new Date().getFullYear()} Al-Akbar. All rights reserved.
      </div>
    </div>
  </div>`;
};

module.exports = {
  generateOrderStatusEmail,
};
