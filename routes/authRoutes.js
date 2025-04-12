const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const jwtAuth = require("../middlewares/jwtAuthMiddleware");

// Login route (no auth required)
router.post("/login", adminController.login);

// Auth verification route
router.get("/verify-auth", jwtAuth, adminController.verifyAuth);

// Logout route (auth required)
router.post("/logout", jwtAuth, adminController.logout);

// Any other admin routes...

module.exports = router;
