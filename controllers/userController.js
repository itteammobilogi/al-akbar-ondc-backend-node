const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Register User
exports.register = async (req, res) => {
  const { name, email, password, dob } = req.body; // <-- added dob

  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser(name, email, hashedPassword, "user", dob); // <-- passing dob

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};

// Logout Controller
exports.logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// Get User Profile
// Get User Profile
exports.userProfile = async (req, res) => {
  const userId = req.user.id; // assuming you're setting req.user in auth middleware

  try {
    const user = await userModel.findUserById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};

// Update User Profile
exports.updateUser = async (req, res) => {
  const userId = req.user.id; // assuming you're setting req.user in auth middleware
  const { name, email, password } = req.body;

  try {
    const existingUser = await userModel.findUserById(userId);
    if (!existingUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    let hashedPassword = existingUser.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await userModel.updateUser(
      userId,
      name || existingUser.name,
      email || existingUser.email,
      hashedPassword
    );

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};
