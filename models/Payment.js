// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  customer_name: String,
  email: String,
  phone: String,
  amount: Number,
  payment_page_link: String,
  page_request_uid: String,
  transaction_uid: String,
  orderNumber: String,
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
