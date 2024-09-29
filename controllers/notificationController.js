const NotificationRequest = require("../models/NotificationRequest");
const nodemailer = require("nodemailer");

exports.notifyMe = async (req, res) => {
  const { fullName, email, phone, notificationMethod, productId } = req.body;

  try {
    const notification = new NotificationRequest({
      fullName,
      email,
      phone,
      notificationMethod,
      productId,
    });

    await notification.save();

    if (notificationMethod === "email") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Notification Request Received",
        text: `Hi ${fullName},\n\nThank you for requesting to be notified when the product is back in stock. We'll notify you at this email address.\n\nBest regards,\nReplicar.`,
      };

      await transporter.sendMail(mailOptions);
    }

    // If WhatsApp is selected, you could send a message via a service like Twilio here

    res
      .status(200)
      .json({ message: "Notification request received successfully" });
  } catch (error) {
    console.error("Error handling notification request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
