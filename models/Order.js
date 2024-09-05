const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: { type: Number, required: true },
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  shippingAddress: {
    city: { type: String, required: true },
    streetAddress: { type: String, required: true },
  },
  orderNotes: { type: String, default: "" },
  status: { type: String, required: true, default: "pending" },
  transaction_uid: {
    type: String,
    required: true, // Ensure the transaction UID is stored and required
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
