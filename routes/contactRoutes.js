const express = require("express");
const { handleContactForm } = require("../controllers/contactController");

const router = express.Router();

router.post("/", handleContactForm); // This should handle POST requests to /contact

module.exports = router;
