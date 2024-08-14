const ClientInfoBeforePurchase = require("../models/clientInfoBeforePurchase");

// Controller to save client info before purchase
exports.saveClientInfo = async (req, res) => {
  const clientData = req.body;

  try {
    const newClientInfo = new ClientInfoBeforePurchase(clientData);
    await newClientInfo.save();
    res.status(200).json({ message: "Client information saved successfully" });
  } catch (error) {
    console.error("Error saving client information:", error);
    res.status(500).json({ message: "Error saving client information" });
  }
};

// Controller to get all client info before purchase
exports.getAllClientInfo = async (req, res) => {
  try {
    const clientInfos = await ClientInfoBeforePurchase.find();
    res.status(200).json(clientInfos);
  } catch (error) {
    console.error("Error retrieving client information:", error);
    res.status(500).json({ message: "Error retrieving client information" });
  }
};
