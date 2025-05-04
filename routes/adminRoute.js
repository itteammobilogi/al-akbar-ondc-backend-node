const express = require("express");
const router = express.Router();
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/adminDashboardCtrl");

router.get("/dashboard/stats", authenticate, authorizeAdmin, getDashboardStats);

module.exports = router;
