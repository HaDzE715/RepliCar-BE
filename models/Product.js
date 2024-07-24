const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  additionalImages: { type: [String], required: true },
  colors: { type: [String], required: true },
});

module.exports = mongoose.model("Product", productSchema);
