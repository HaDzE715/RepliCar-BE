const axios = require("axios");
require("dotenv").config();

exports.generatePaymentLink = async (req, res) => {
  try {
    const { amount, description, customer } = req.body;

    const response = await axios.post(
      "https://restapi.payplus.co.il/api/v1.0/PaymentPages/generateLink",
      {
        payment_page_uid: "6dc56201-ef08-43ab-bfb9-a68931d6fb15", // Replace with your actual UID
        charge_method: 1,
        amount: amount,
        currency_code: "ILS",
        sendEmailApproval: true,
        sendEmailFailure: true,
        description: description,
        customer: customer,
      },
      {
        headers: {
          Authorization: JSON.stringify({
            api_key: process.env.PAYPLUS_API_KEY,
            secret_key: process.env.PAYPLUS_API_SECRET_KEY,
          }),
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.response
        ? error.response.data
        : "Error generating payment link",
    });
  }
};
