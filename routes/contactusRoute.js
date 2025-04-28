const express = require("express");
const { submitContactForm } = require("../controllers/contactusCtrl");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

// POST /api/contact
router.post("/send-message", authenticate, submitContactForm);

module.exports = router;
