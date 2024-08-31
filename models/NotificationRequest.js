const mongoose = require('mongoose');

const NotificationRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  notificationMethod: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  requestedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('NotificationRequest', NotificationRequestSchema);
