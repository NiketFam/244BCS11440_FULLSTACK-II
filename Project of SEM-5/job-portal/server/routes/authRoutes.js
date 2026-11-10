const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, getProfile, updateProfile } = require("../controllers/authController");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

// Rate limiter for auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  message: { message: "Too many authentication attempts, please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
