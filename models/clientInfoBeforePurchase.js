const mongoose = require("mongoose");

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
  createdAt: { type: Date, default: Date.now },
});

const ClientInfoBeforePurchase = mongoose.model(
  "ClientInfoBeforePurchase",
  clientInfoBeforePurchaseSchema
);

module.exports = ClientInfoBeforePurchase;
