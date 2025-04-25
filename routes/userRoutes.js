const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;

// reset the password in xamp 8.2 /phpmyadmin/config.in.php         changes the root and password
