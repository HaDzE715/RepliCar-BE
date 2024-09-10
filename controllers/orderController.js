const Order = require("../models/Order");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Product = require("../models/Product"); // Make sure the path is correct

require("dotenv").config();

// Email template generator
// Email template generator
// Email template generator
const createEmailTemplate = ({
  clientName,
  orderNumber,
  totalPrice,
  shippingAddress,
  products,
  orderNotes,
  email,
}) => {
  const productRows = products
    .map(
      (product) => `
      <tr>
        <td style="text-align: right;">${product.productName}</td>
        <td style="text-align: right;">${product.quantity}</td>
        <td style="text-align: right;">${
          product.price ? product.price : "לא זמין"
        }₪</td>
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
        background-color: #eceef4;
        margin: 0;
        padding: 20px;
        direction: rtl;
        font-family: "Noto Sans Hebrew", sans-serif;
      }
      .receipt-content .invoice-wrapper {
        background: #fff;
        border: 1px solid #cdd3e2;
        box-shadow: 0px 0px 1px #ccc;
        padding: 40px 40px 60px;
        margin-top: 40px;
        border-radius: 4px;
      }
      .payment-info,
      .payment-details,
      .line-items {
        margin-top: 20px;
      }
      .invoice-wrapper .payment-details span,
      .invoice-wrapper .payment-info span {
        color: #a9b0bb;
      }
      .invoice-wrapper .payment-details strong,
      .invoice-wrapper .payment-info strong {
        color: #444;
      }
      .invoice-wrapper .line-items .total {
        text-align: right;
        margin-top: 30px;
      }
      .product-table th,
      .product-table td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: right;
      }
      .total {
        font-weight: bold;
        font-size: 16px;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #999;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        width: 150px; /* Adjust the size of your logo */
        height: auto;
      }
    </style>
  </head>
  <body>
    <div class="receipt-content">
      <div class="container">
        <div class="invoice-wrapper">
          <!-- Logo Section -->
          <div class="logo">
            <img src="https://i.imgur.com/2Sqkz6S.jpeg" alt="Business Logo" />
          </div>

          <div class="intro" style="text-align: right; direction: rtl;">
            שלום <strong>${clientName}</strong>,
            <br />
            זו הקבלה לתשלום על סך <strong>${totalPrice}₪</strong> עבור הרכישה
            שלך.
          </div>

          <div class="payment-info">
            <div class="row">
              <div class="col-sm-6" style="text-align: right;">
                <span>מספר עסקה</span>
                <strong>${orderNumber}</strong>
              </div>
              <div class="col-sm-6" style="text-align: right;">
                <span>תאריך עסקה</span>
                <strong>${currentDate}</strong>
              </div>
            </div>
          </div>

          <div class="payment-details">
            <div class="row">
              <div class="col-sm-6" style="text-align: right;">
                <span>לקוח</span>
                <strong>${clientName}</strong>
                <p>
                  ${shippingAddress.streetAddress} <br />
                  ${shippingAddress.city} <br />
                  <a href="#">${email}</a>
                </p>
              </div>
              <div class="col-sm-6" style="text-align: right;">
                <span>לתשלום אל</span>
                <strong>ה.פ איקומרס</strong>
                <p>
                  מספר עוסק: 315490409<br />
                  אין מע"מ על העסקה<br />
                  <a href="#">Repli.car911@gmail.com</a>
                </p>
              </div>
            </div>
          </div>

          <div class="line-items" style="text-align: right; direction: rtl;">
            <div class="items" style="text-align: right; direction: rtl;">
              <table class="product-table">
                <thead>
                  <tr>
                    <th>מוצר</th>
                    <th>כמות</th>
                    <th>סכום</th>
                  </tr>
                </thead>
                <tbody>
                  ${productRows}
                </tbody>
              </table>
            </div>
            <div class="total text-right">
              <div class="field">סה"כ <span>${totalPrice}₪</span></div>
              <div class="field grand-total">
                סה"כ לתשלום <span>${totalPrice}₪</span>
              </div>
            </div>
          </div>

          <div class="footer" style="text-align: center; direction: rtl;">
            <p>עסק פטור - קבלה זו אינה כוללת מע"מ</p>
          </div>
        </div>
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
const getNextReceiptNumber = async () => {
  // Fetch the total number of orders
  const totalOrders = await Order.countDocuments();

  // Calculate the next receipt number
  return 1000 + totalOrders;
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
    // Fetch product details and update stock quantities
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const productData = await Product.findById(product.product).lean();
        if (!productData) {
          throw new Error(`Product with ID ${product.product} not found`);
        }

        // Update product quantity (reduce stock)
        const updatedProduct = await Product.findByIdAndUpdate(
          product.product,
          {
            $inc: { quantity: -product.quantity }, // Decrease the quantity by the purchased amount
          },
          { new: true } // Return the updated document
        );

        return {
          productName: productData.name,
          quantity: product.quantity,
          price: productData.price,
        };
      })
    );
    const receiptNumber = await getNextReceiptNumber();

    // Create the order
    const newOrder = new Order({
      orderNumber: receiptNumber,
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
        product: new mongoose.Types.ObjectId(product.product),
        quantity: product.quantity,
      })),
      totalPrice,
      orderNotes,
      transaction_uid,
    });

    // Validate before saving
    await newOrder.validate();

    // Save the order to the database
    const savedOrder = await newOrder.save();
    // Send email upon order creation
    await sendOrderConfirmationEmail({
      clientName: user.name,
      orderNumber: receiptNumber,
      totalPrice,
      shippingAddress,
      products: productDetails,
      orderNotes,
      email: user.email,
    });
    console.log("test", req.body.user.email);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Here? Error creating order:", error.message);
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
