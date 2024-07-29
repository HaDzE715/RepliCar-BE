const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
require("dotenv").config();

// Create a transporter object using your email service provider
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for sensitive data
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email
const sendContactEmail = async (contactData) => {
  const { firstName, lastName, phone, email, message, clientType } =
    contactData;

  try {
    await transporter.sendMail({
      from: '"A new message from RepliCar😊" Repli.car911@gmail.com', // Replace with your email
      to: "hadebayaa@gmail.com, firasdeeb2@gmail.com", // Replace with your email
      subject: "New Contact Us Submission",
      html: `
        <h1>New Contact Us Submission</h1>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Client Type:</strong> ${clientType}</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Error sending email" };
  }
};

module.exports = { sendContactEmail };
