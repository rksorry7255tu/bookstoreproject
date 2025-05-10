const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn.js");
const cors = require("cors");
const User = require("./routes/user.js");
const Books = require("./routes/book.js");
const Favourite = require("./routes/favourite.js");
const Cart = require("./routes/cart.js");
const Order = require("./routes/order.js");
const Razorpay = require("razorpay");
const path = require("path");

const corsOptions = {
  origin: "http:localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const _dirname = path.resolve();

//routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

app.get("/", (req, res) => {
  res.send("hello from backend");
});

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Razorpay integration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_e3YrzIvK51IX4w", // Use environment variable or fallback to test key
  key_secret: process.env.RAZORPAY_KEY_SECRET || "r0zJT01LftFGrs9B3aY8lPnK", // Use environment variable or fallback to test secret
});

app.post("/Razorpay", async (req, res) => {
  const options = {
    amount: req.body.amount, // Amount in paise
    currency: req.body.currency || "INR", // Default to INR if not provided
    receipt: "receipt#1", // Unique receipt ID
    payment_capture: 1, // Auto capture payment
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/payment/:paymentId", async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
});

//creating port
app.listen(process.env.PORT || 3000, () => {
  console.log("server started");
});
