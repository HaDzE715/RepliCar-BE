const Order = require("../models/Order");
const mongoose = require("mongoose");
// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  const {
    user,
    products,
    orderNumber,
    totalPrice,
    shippingAddress,
    orderNotes,
    transaction_uid,
  } = req.body;

  // Ensure user and products array are well-formed
  if (!user || !user.name || !user.email || !user.phone) {
    return res.status(400).json({ message: "User details are required" });
  }

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Products are required" });
  }

  if (
    !shippingAddress ||
    !shippingAddress.streetAddress ||
    !shippingAddress.city
  ) {
    return res.status(400).json({ message: "Shipping address is required" });
  }

  try {
    // Step 1: Verify the transaction with PayPlus
    const verifyTransaction = await axios.post(
      "https://restapi.payplus.co.il/api/v1.0/TransactionReports/TransactionsApproval",
      {
        terminal_uid: process.env.PAYPLUS_TERMINAL_UID, // Your PayPlus terminal UID
        filter: { uuid: transaction_uid }, // The transaction UID passed from the client
        currency_code: "ILS",
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

    // Check if the transaction is approved
    const transactionData = verifyTransaction.data;
    if (transactionData.status !== "approved") {
      return res.status(400).json({ message: "Transaction not approved" });
    }

    // Step 2: Create the order if the transaction is verified
    const newOrder = new Order({
      orderNumber,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      shippingAddress: {
        city: shippingAddress.city,
        streetAddress: shippingAddress.streetAddress,
      },
      products: products.map((product) => ({
        product: new mongoose.Types.ObjectId(product.product), // Correct usage of ObjectId
        quantity: product.quantity,
      })),
      totalPrice,
      orderNotes,
    });

    // Validate and save the order
    await newOrder.validate();
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
