const express = require("express");
const { generatePaymentLink } = require("../controllers/paymentController");
const router = express.Router();

router.post("/generate-payment-link", generatePaymentLink);

module.exports = router;
