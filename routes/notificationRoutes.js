const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController.js");

router.post("/notify-me", notificationController.notifyMe);

module.exports = router;
