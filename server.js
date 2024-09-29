const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes");
const contactRoutes = require("./routes/contactRoutes");
const clientInfoBeforePurchaseRoutes = require("./routes/clientInfoBeforePurchaseRoutes");
const ordersRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const app = express();

require("dotenv").config();
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
      mongoUrl: process.env.MONGO_URI, 
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1-day session
    },
  })
);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/products/discounted", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/contact", contactRoutes);
app.use("/api/clientInfoBeforePurchase", clientInfoBeforePurchaseRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api", notificationRoutes);
app.use("/api", paymentRoutes);
app.use("/api/admin", authRoutes);
app.use("/api", subscriptionRoutes);

// Middleware to protect admin routes
const isLoggedIn = (req, res, next) => {
  if (!req.session.adminId) {
    return res
      .status(401)
      .json({ message: "Please log in to access this resource" });
  }
  next();
};

// Protect the admin routes
app.use("/api/admin/products", isLoggedIn, productRoutes); 

// API for UptimeRobot
app.get("/", (req, res) => {
  res.send("Backend is up and running");
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
