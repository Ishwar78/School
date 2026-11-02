const express = require("express");
const Admin = require("../models/Admin");

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Authenticate admin & return user info
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials.",
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin authentication successful.",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role || "admin",
      },
    });
  } catch (error) {
    console.error("[Admin Login Route Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
});

// @route   GET /api/admin/verify
// @desc    Check admin status / health
// @access  Public
router.get("/verify", async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    return res.status(200).json({
      success: true,
      adminCount: count,
      message: "Admin service is operational.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

