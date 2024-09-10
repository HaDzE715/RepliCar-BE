const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

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
