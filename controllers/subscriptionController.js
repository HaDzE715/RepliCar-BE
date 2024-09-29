const { appendToSheet } = require("../services/googleSheets");
const nodemailer = require("nodemailer");
const emailTemplate = require("../templates/emailTemplate");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Controller to handle subscription
exports.subscribeUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    // Append email to Google Sheet
    await appendToSheet(email);

    // Send confirmation email
    await transporter.sendMail({
      from: `"Replicar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for subscribing!",
      html: emailTemplate,
      attachments: [
        {
          filename: "logo.jpg",
          path: "./Pictures/logo.jpg",
          cid: "logo",
        },
        {
          filename: "collection.jpg",
          path: "./Pictures/collection.png",
          cid: "collection",
        },
        {
          filename: "product.jpg",
          path: "./Pictures/Tiffany1.jpeg",
          cid: "product",
        },
      ],
    });

    console.log("Email sent successfully");
    res.status(200).json({ success: true, message: "Subscription successful" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
