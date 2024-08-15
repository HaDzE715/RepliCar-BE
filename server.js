const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes");
const contactRoutes = require("./routes/contactRoutes");
const clientInfoBeforePurchaseRoutes = require("./routes/clientInfoBeforePurchaseRoutes");

const { appendToSheet } = require("./services/googleSheets");
const nodemailer = require("nodemailer");
const emailTemplatePath = path.join(
  __dirname,
  "./templates",
  "emailTemplate.html"
);
let emailTemplate;
emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

const app = express();

// Load environment variables
require("dotenv").config();

// Connect to MongoDB
const dbConnection = connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/contact", contactRoutes); // This should mount contactRoutes at /contact
app.use("/api/clientInfoBeforePurchase", clientInfoBeforePurchaseRoutes);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
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
          path: "./Pictures/logo.jpg", // Replace with your image file path
          cid: "logo", // same cid value as in the html img src
        },
        {
          filename: "collection.jpg",
          path: "./Pictures/collection.jpg", // Replace with your image file path
          cid: "collection",
        },
        {
          filename: "product.jpg",
          path: "./Pictures/Tiffany1.jpeg", // Replace with your image file path
          cid: "product",
        },
        {
          filename: "footerLogo.jpg",
          path: "./Pictures/logo.jpg", // Replace with your image file path
          cid: "footerLogo",
        },
        {
          filename: "instalogo.png",
          path: "./Pictures/instalogo.png", // Replace with your image file path
          cid: "instalogo",
        },
        {
          filename: "emaillogo.png",
          path: "./Pictures/EmailLogo.png", // Replace with your image file path
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
  await dbConnection.close(); // Close the MongoDB connection
  process.exit(0); // Exit the process
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
