const express = require("express");
const router = express.Router();
const clientInfoBeforePurchaseController = require("../controllers/clientInfoBeforePurchaseController");

// Route to save client info before purchase
router.post("/", clientInfoBeforePurchaseController.saveClientInfo);

// Route to get all client info before purchase
router.get("/", clientInfoBeforePurchaseController.getAllClientInfo);

module.exports = router;
