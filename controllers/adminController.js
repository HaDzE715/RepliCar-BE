const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Make sure to install jsonwebtoken
const Admin = require("../models/Admin");

// Admin login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Adjust expiration as needed
    );

    // Send the admin profile information with token
    res.status(200).json({
      message: "Login successful",
      admin: {
        _id: admin._id,
        email: admin.email,
        profilePicture: admin.profilePicture,
        name: admin.name,
        token, // Include the JWT token
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin logout controller
exports.logout = (req, res) => {
  // With JWT, the actual logout happens on the client
  // by removing the token from storage
  res.status(200).json({ message: "Logout successful" });
};

// Add verify auth endpoint
exports.verifyAuth = async (req, res) => {
  // The middleware has already verified the token
  // and attached the admin to the request
  res.status(200).json({
    authenticated: true,
    admin: {
      _id: req.admin._id,
      email: req.admin.email,
      name: req.admin.name,
      profilePicture: req.admin.profilePicture,
    },
  });
};
