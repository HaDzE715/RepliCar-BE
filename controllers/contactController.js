const { sendContactEmail } = require("../services/emailService");

const handleContactForm = async (req, res) => {
  const contactData = req.body;

  const result = await sendContactEmail(contactData);

  if (result.success) {
    res.status(200).send("Email sent successfully");
  } else {
    res.status(500).send(result.error);
  }
};

module.exports = { handleContactForm };
