const express = require("express");
const router = express.Router();
const { sendSubscriptionEmail } = require("../services/emailService");
require("dotenv").config();

// Mock function to simulate appending to a sheet
async function appendToSheet(email) {
  console.log(`Appending ${email} to sheet`);
}

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    await appendToSheet(email);
    const result = await sendSubscriptionEmail(email);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /subscribe route:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
