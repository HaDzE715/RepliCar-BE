const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const brandRoutes = require("./routes/brandRoutes");

const app = express();

// Load environment variables
require("dotenv").config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/brands", brandRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
