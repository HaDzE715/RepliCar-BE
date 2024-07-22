const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  founder: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  month: { type: String, required: true },
  day: { type: Number, required: true },
  year: { type: Number, required: true },
  logo: { type: String, required: true },
});

module.exports = mongoose.model("Brand", brandSchema);
