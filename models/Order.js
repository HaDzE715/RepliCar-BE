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
  transaction_uid: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add a pre-save hook to update 'updatedAt' automatically
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Order", orderSchema);
