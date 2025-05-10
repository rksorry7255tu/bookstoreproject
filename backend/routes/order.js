const authenticateToken = require("./userAuth.js");
const User = require("../models/user.js");

const Order = require("../models/order.js");

const router = require("express").Router();

//place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;
    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      //save order in user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      //clearing cart
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }
    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error" });
  }
});

//get-order-history
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });
    const ordersData = userData.orders.reverse();
    return res.status(200).json({
      status: "success",
      data: ordersData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error occurs" });
  }
});

//get all orderd history
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const orderData = await Order.find()
      .populate({ path: "book" })
      .populate({ path: "user" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ status: "success", data: orderData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error" });
  }
});

//update order --admin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.json({
      status: "success",
      message: "Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error" });
  }
});

module.exports = router;
