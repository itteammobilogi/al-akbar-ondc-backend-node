require("dotenv").config();

const db = require("../config/db");
const nodemailer = require("nodemailer");

exports.submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    // Insert into database
    const insertQuery = `
      INSERT INTO contacts (name, email, message)
      VALUES (?, ?, ?)
    `;
    await db.promise().query(insertQuery, [name, email, message]);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Admin Email
    const adminMailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Us Message from ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    // Member Confirmation Email (with Logo)
    const userMailOptions = {
      from: `"Al-Akbar Clothing" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting Al-Akbar!",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #fff9f8; padding: 20px; border-radius: 10px; text-align: center;">
          <img src="https://lsmedia.linker-cdn.net/275228/2021/5456322.jpeg" alt="Company Logo" style="width: 120px; margin-bottom: 20px;" />
          <h2 style="color: #be123c;">Hello ${name},</h2>
          <p style="color: #555;">Thank you for reaching out to us!</p>
          <p style="color: #555;">We've received your message and our team will get back to you shortly.</p>
          <div style="margin-top: 30px;">
            <a href="https://al-akbar.in" style="display: inline-block; padding: 12px 24px; background-color: #be123c; color: #fff; border-radius: 30px; text-decoration: none; font-weight: bold;">Visit Our Website</a>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">&copy; 2025 Al-Akbar Clothing. All rights reserved.</p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({
      success: true,
      message: `🌟 Thank you, ${name}! We've received your message and a confirmation email has been sent to you.`,
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Oops! Something went wrong. Please try again later.",
    });
  }
};
