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

  // Ensure that user and products array are well-formed
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
        product: new mongoose.Types.ObjectId(product.product), // Correct usage of ObjectId with 'new'
        quantity: product.quantity,
      })),
      totalPrice,
      orderNotes,
      transaction_uid,
    });

    // Validate before saving to catch any schema-related issues
    await newOrder.validate();

    // Save the order to the database
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
