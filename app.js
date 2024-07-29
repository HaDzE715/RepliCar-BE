const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { appendToSheet } = require("./googleSheets");

const app = express();

// Load environment variables
require("dotenv").config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/contact", contactRoutes); // This should mount contactRoutes at /contact

// Subscription route
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    await appendToSheet(email);
    res.status(200).send("Subscription successful");
  } catch (error) {
    console.error("Error appending to sheet:", error);
    res.status(500).send("Error subscribing to newsletter");
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
