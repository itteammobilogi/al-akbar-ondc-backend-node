const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/getuser/profile", authenticate, userController.userProfile);
router.put("/profile", authenticate, userController.updateUser);
module.exports = router;

// reset the password in xamp 8.2 /phpmyadmin/config.in.php         changes the root and password
