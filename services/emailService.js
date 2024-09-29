const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendContactEmail(contactData) {
  const { firstName, lastName, email, message } = contactData;

  const mailOptions = {
    from: `"Replicar Contact Form" <${process.env.EMAIL_USER}>`,
    to: "hadebayaa@gmail.com",
    subject: "New Contact Form Submission",
    text: `You have a new contact form submission:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Error sending email" };
  }
}

module.exports = { sendContactEmail };
