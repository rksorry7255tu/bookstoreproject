const authenticateToken = require("./userAuth.js");
const User = require("../models/user.js");

const router = require("express").Router();

router.put("/addToCart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const cartUser = await User.findById(id);

    const isBookInCart = cartUser.cart.includes(bookid);
    if (isBookInCart) {
      return res.status(200).json({
        message: "Book is already in cart",
      });
    }

    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({ message: "added to card" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ messgae: "Internal error" });
  }
});

//remove from cart
router.put("/delete-From-Cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { bookid } = req.params;

    await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
    return res
      .status(200)
      .json({ message: "Book removed from cart", success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal error occurs" });
  }
});

//get cart of particular user
router.get("/get-user-cart-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();
    return res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error occurs" });
  }
});
module.exports = router;
