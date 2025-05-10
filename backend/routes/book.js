const router = require("express").Router();
const User = require("../models/user.js");
const Book = require("../models/book.js");
const authenticateToken = require("./userAuth.js");

//add-book
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You are not having access to perform admin work" });
    }
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      disc: req.body.disc,
      language: req.body.language,
    });
    await book.save();
    res.status(200).json({ message: "Book adds successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update book
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      disc: req.body.disc,
      language: req.body.language,
    });
    return res.status(200).json({
      message: "Book Updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal error occur" });
  }
});

//delete-book
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    if (!bookid) {
      return res.status(400).json({ message: "book id required" });
    }
    const result = await Book.findByIdAndDelete(bookid);
    if (!result) {
      return res.status(404).json({ message: "book not found" });
    }
    const result1 = await Order.findByIdAndDelete(bookid);
    if (!result1) {
      return res
        .status(404)
        .json({ message: "book deleted from order history" });
    }
    return res.status(200).json({ message: "book deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal error occur",
    });
  }
});

//get-all-books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal error occur" });
  }
});

//get recent added books limit-4
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().limit(4).sort({ createdAt: -1 });
    return res.status(200).json({
      status: "success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal error occurs" });
  }
});

//get book by id
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(req.params.id);
    return res.status(200).json({ data: book });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internam error occur" });
  }
});

module.exports = router;
