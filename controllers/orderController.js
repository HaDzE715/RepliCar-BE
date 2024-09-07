const Order = require("../models/Order");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Product = require("../models/Product"); // Make sure the path is correct

require("dotenv").config();

// Email template generator
const createEmailTemplate = ({
  clientName,
  orderNumber,
  totalPrice,
  shippingAddress,
  products,
  orderNotes,
}) => {
  const productRows = products
    .map(
      (product) => `
      <tr>
        <td>${product.productName}</td>
        <td>${product.quantity}</td>
        <td>${product.price ? product.price : "לא זמין"}₪</td>
      </tr>`
    )
    .join("");
  const currentDate = new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  return `
  <!DOCTYPE html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>קבלה</title>
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
        font-family: "Noto Sans Hebrew", sans-serif;
      }
      .receipt-container {
        background-color: white;
        max-width: 600px;
        margin: auto;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        text-align: right;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        position: relative;
      }
      .logo-container {
        position: absolute;
        top: 10px;
        text-align: center;
      }
      .logo-container img {
        width: 100px;
      }
      h1, h2 {
        color: #333;
        margin-bottom: 10px;
        direction: rtl !important;
      }
      p {
        color: #555;
        margin-bottom: 10px;
        direction: rtl !important;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        margin-bottom: 8px;
        color: #333;
      }
      .business-info, .customer-info {
        margin-bottom: 20px;
        font-size: 14px;
        direction: rtl !important;
      }
      .product-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .product-table th, .product-table td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: right;
      }
      .product-table th {
        background-color: #f8f8f8;
      }
      .total {
        font-weight: bold;
        font-size: 16px;
        margin-top: 20px;
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
    <div class="receipt-container">
      <div class="logo-container">
        <img src="https://i.imgur.com/L7iIGLi.jpeg" alt="Business Logo" />
      </div>

      <h1>תודה על הרכישה שלך, ${clientName}!</h1>
      <p>הזמנתך נקלטה בהצלחה. להלן פרטי העסקה שלך:</p>

      <div class="business-info">
        <strong>פרטי העסק:</strong>
        <ul>
          <li>שם העסק: ה.פ איקומרס</li>
          <li>מספר עוסק: 315490409</li>
        </ul>
      </div>

      <div class="customer-info">
        <strong>פרטי הלקוח:</strong>
        <ul>
          <li>שם הלקוח: ${clientName}</li>
          <li>כתובת למשלוח: ${shippingAddress.streetAddress}, ${
    shippingAddress.city
  }</li>
          <li>הערות להזמנה: ${orderNotes || "אין הערות"}</li>
        </ul>
      </div>

      <h2>פרטי מוצרים:</h2>
      <table class="product-table">
        <thead>
          <tr>
            <th>מוצר</th>
            <th>כמות</th>
            <th>מחיר</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>

      <p class="total">סה"כ לתשלום: ${totalPrice}₪</p>

      <p>מספר קבלה: ${orderNumber}</p>
      <p>תאריך ושעה: ${currentDate}</p>

      <div class="footer">
        <p>עסק פטור - קבלה זו אינה כוללת מע"מ</p>
      </div>
    </div>
  </body>
</html>

`;
};

// Function to send the email
const sendOrderConfirmationEmail = async (orderDetails) => {
  // Configure the transport for email
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or use any other email service provider
    auth: {
      user: process.env.EMAIL_USER, // Sender's email address
      pass: process.env.EMAIL_PASS, // Sender's email password
    },
  });

  // Mail options
  const mailOptions = {
    from: "Replicar", // Sender address
    to: orderDetails.email, // Receiver email
    bcc: "hadebayaa@gmail.com, firasdeeb2@gmail.com",
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
    // Fetch product details from the database
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const productData = await Product.findById(product.product).lean();
        if (!productData) {
          throw new Error(`Product with ID ${product.product} not found`);
        }
        return {
          productName: productData.name, // Assuming your product schema has a 'name' field
          quantity: product.quantity,
          price: productData.price,
        };
      })
    );
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
      products: productDetails,
      orderNotes,
      email: req.body.user.email,
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
