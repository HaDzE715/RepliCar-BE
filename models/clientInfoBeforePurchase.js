const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to the product _id
  name: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Boolean, required: false },
  quantity: { type: Number, required: true }, // Quantity of the product in the cart
});

const clientInfoBeforePurchaseSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true },
  streetAddress: { type: String, required: true },
  orderNotes: { type: String, required: false },
  totalQuantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  cart: [cartItemSchema], // Add the cart as an array of items
  createdAt: { type: Date, default: Date.now },
});

const ClientInfoBeforePurchase = mongoose.model(
  "ClientInfoBeforePurchase",
  clientInfoBeforePurchaseSchema
);

module.exports = ClientInfoBeforePurchase;
