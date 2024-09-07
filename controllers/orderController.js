const Order = require("../models/Order");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
// Email template generator
const createEmailTemplate = ({
  clientName,
  orderNumber,
  totalPrice,
  shippingAddress,
  products,
  orderNotes,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="he">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>אישור הזמנה</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;700&display=swap"
          rel="stylesheet"
        />

        <style>
          body {
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            direction: rtl;
            font-family: 'Noto Sans Hebrew', sans-serif;
          }
          .email-container {
            background-color: white;
            max-width: 600px;
            margin: auto;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            text-align: right;
          }
          h1 {
            color: #333;
          }
          h2 {
            color: #333;
            margin-bottom: 10px;
          }
          p {
            color: #555;
            margin-bottom: 15px;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th,
          td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: right;
          }
          th {
            background-color: #f8f8f8;
          }
          .button {
            text-align: center;
            margin-top: 30px;
          }
          .button a {
            color: white;
            background-color: #28a745;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h1>תודה על הרכישה שלך, ${clientName}!</h1>
          <p>הזמנתך נקלטה בהצלחה. להלן פרטי ההזמנה שלך:</p>

          <h2>פרטי הזמנה:</h2>
          <ul>
            <li><strong>מספר הזמנה:</strong> ${orderNumber}</li>
            <li><strong>סכום לתשלום:</strong> ${totalPrice}₪</li>
            <li><strong>כתובת למשלוח:</strong> ${
              shippingAddress.streetAddress
            }, ${shippingAddress.city}</li>
            <li><strong>הערות להזמנה:</strong> ${orderNotes || "אין"}</li>
          </ul>

          <h2>פרטי מוצרים:</h2>
          <table>
            <thead>
              <tr>
                <th>מוצר</th>
                <th>כמות</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (product) => `
                  <tr>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>

          <p>ההזמנה שלך תטופל בקרוב. תקבל/י עדכון כאשר היא תהיה מוכנה למשלוח.</p>
        </div>
      </body>
    </html>
  `;
};

// Function to send the email
const sendOrderConfirmationEmail = async (orderDetails) => {
  // Configure the transport for email
  const transporter = nodemailer.createTransport({
    service: "gmail", // Or use any other email service provider
    auth: {
      user: process.env.EMAIL, // Sender's email address
      pass: process.env.EMAIL_PASSWORD, // Sender's email password
    },
  });

  // Mail options
  const mailOptions = {
    from: "no-reply@replicar.co.il", // Sender address
    to: orderDetails.user.email, // Receiver email
    subject: `אישור הזמנה - מספר הזמנה: ${orderDetails.orderNumber}`,
    html: createEmailTemplate(orderDetails), // HTML body
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
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
    // Send email upon order creation
    await sendOrderConfirmationEmail({
      clientName: user.name,
      orderNumber,
      totalPrice,
      shippingAddress,
      products,
      orderNotes,
    });
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
