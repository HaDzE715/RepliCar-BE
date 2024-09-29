const express = require("express");
const router = express.Router();
const { subscribeUser } = require("../controllers/subscriptionController");

// Define the POST route for subscription
router.post("/subscribe", subscribeUser);

module.exports = router;
