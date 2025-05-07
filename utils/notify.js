const nodemailer = require("nodemailer");
// const twilio = require("twilio");

// ✅ Email
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Shop" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

// ✅ SMS
// const sendSMS = async (to, message) => {
//   const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
//   await client.messages.create({
//     body: message,
//     from: process.env.TWILIO_PHONE,
//     to,
//   });
// };

module.exports = {
  sendEmail,
  // sendSMS,
};
