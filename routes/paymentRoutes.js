const express = require("express");
const {
  generatePaymentLink,
  paymentCallback,
} = require("../controllers/paymentController");
const router = express.Router();

router.post("/generate-payment-link", generatePaymentLink);
router.post("/payment-callback", paymentCallback);

module.exports = router;
