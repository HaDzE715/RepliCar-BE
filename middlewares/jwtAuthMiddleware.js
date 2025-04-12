// middleware/jwtAuthMiddleware.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const jwtAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        authenticated: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).json({
        authenticated: false,
        message: "Admin not found",
      });
    }

    // Attach admin to request
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({
      authenticated: false,
      message: "Authentication failed",
    });
  }
};

module.exports = jwtAuth;
