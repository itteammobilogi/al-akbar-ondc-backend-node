const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Register User
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser(name, email, hashedPassword);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "User Not Found !" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      user: {
        name: user.name, // or email: user.email
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};
