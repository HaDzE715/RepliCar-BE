const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes");
const contactRoutes = require("./routes/contactRoutes");
const clientInfoBeforePurchaseRoutes = require("./routes/clientInfoBeforePurchaseRoutes");
const ordersRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");

const { appendToSheet } = require("./services/googleSheets");
const nodemailer = require("nodemailer");
const emailTemplatePath = path.join(
  __dirname,
  "./templates",
  "emailTemplate.html"
);
let emailTemplate;
emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

const Admin = require("./models/Admin"); // Assuming you have an Admin model

const app = express();

// Load environment variables
require("dotenv").config();

// Connect to MongoDB
const dbConnection = connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Your MongoDB connection string
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1-day session
    },
  })
);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/contact", contactRoutes);
app.use("/api/clientInfoBeforePurchase", clientInfoBeforePurchaseRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api", notificationRoutes);
app.use("/api", paymentRoutes);
app.use("/api/admin", authRoutes);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Admin login route
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If credentials are valid, create a session
    req.session.adminId = admin._id;
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin logout route
app.post("/api/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logout successful" });
  });
});

// Middleware to protect admin routes
const isLoggedIn = (req, res, next) => {
  if (!req.session.adminId) {
    return res
      .status(401)
      .json({ message: "Please log in to access this resource" });
  }
  next();
};

// Example of a protected admin route
app.use("/api/admin/products", isLoggedIn, productRoutes); // Protect the admin routes

// API for UptimeRobot
app.get("/", (req, res) => {
  res.send("Backend is up and running");
});

// Subscription route
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    await appendToSheet(email);

    await transporter.sendMail({
      from: `"Replicar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for subscribing!",
      html: emailTemplate,
      attachments: [
        {
          filename: "logo.jpg",
          path: "./Pictures/logo.jpg",
          cid: "logo",
        },
        {
          filename: "collection.jpg",
          path: "./Pictures/collection.jpg",
          cid: "collection",
        },
        {
          filename: "product.jpg",
          path: "./Pictures/Tiffany1.jpeg",
          cid: "product",
        },
        {
          filename: "footerLogo.jpg",
          path: "./Pictures/logo.jpg",
          cid: "footerLogo",
        },
        {
          filename: "instalogo.png",
          path: "./Pictures/instalogo.png",
          cid: "instalogo",
        },
        {
          filename: "emaillogo.png",
          path: "./Pictures/EmailLogo.png",
          cid: "emaillogo",
        },
      ],
    });

    console.log("Email sent successfully");
    res.status(200).json({ success: true, message: "Subscription successful" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection and shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
