const jwt = require("jsonwebtoken");

const secret = "your_jwt_secret";

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, secret, {
    expiresIn: "7d",
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secret);
};
