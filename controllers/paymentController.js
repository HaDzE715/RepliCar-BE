const axios = require("axios");
const atob = require("atob");
require("dotenv").config();

const Payment = require("../models/Payment");

exports.generatePaymentLink = async (req, res) => {
  try {
    const { amount, description, customer } = req.body;

    // Make API call to PayPlus to generate the payment link
    const response = await axios.post(
      "https://restapi.payplus.co.il/api/v1.0/PaymentPages/generateLink",
      {
        payment_page_uid: "6dc56201-ef08-43ab-bfb9-a68931d6fb15",
        charge_method: 1,
        amount: amount,
        currency_code: "ILS",
        sendEmailApproval: false,
        sendEmailFailure: true,
        description: description,
        customer: customer,
        callback_url: `${process.env.BASE_URL}/api/payment-callback`,
        send_failure_callback: true,
        refURL_success: "https://www.replicar.co.il/payment-success",
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

    // Store payment information in database
    const newPayment = new Payment({
      amount,
      description,
      customer_name: customer.customer_name,
      payment_page_link: response.data.data.payment_page_link,
      page_request_uid: response.data.data.page_request_uid,
      status: "pending", // Default status until the payment is confirmed
    });

    await newPayment.save();

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

exports.paymentCallback = async (req, res) => {
  try {
    const { transaction_status, transaction_uid, amount, hash_data } = req.body;

    // Decode the Base64 hash_data
    if (hash_data) {
      const decodedData = atob(hash_data); // Decode from Base64
      console.log("Decoded hash data:", decodedData);
    }

    // Find the payment by the unique transaction UID
    const payment = await Payment.findOne({ transaction_uid });

    if (!payment) {
      return res.status(404).send("Payment not found");
    }

    // Update payment status based on the transaction_status
    if (transaction_status === "success") {
      payment.status = "success";
      console.log("Payment successful");
      res.status(200).send("Payment successful");
    } else {
      payment.status = "failed";
      console.log("Payment failed");
      res.status(500).send("Payment failed");
    }

    // Save the updated payment status
    await payment.save();
  } catch (error) {
    console.error("Error processing payment callback:", error);
    res.status(500).send("Error processing callback");
  }
};
