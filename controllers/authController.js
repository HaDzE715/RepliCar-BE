const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin"); // Assuming Admin model is in ../models folder

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

    // If credentials are valid, create a session
    req.session.adminId = admin._id;

    // Send the admin profile information upon successful login
    res.status(200).json({
      message: "Login successful",
      admin: {
        email: admin.email,
        profilePicture: admin.profilePicture, // Send profile picture
        name: admin.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin logout controller
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logout successful" });
  });
};
