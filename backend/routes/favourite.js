const authenticateToken = require("./userAuth");
const User = require("../models/user");

const router = require("express").Router();

//add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res.status(200).json({ message: "Book is already in favourites" });
    }
    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ message: "Book added to favourites" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete book from favourites
router.put(
  "/delete-book-from-favourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userData = await User.findById(id);
      const isBookFavourite = userData.favourites.includes(bookid);
      if (isBookFavourite) {
        await User.findByIdAndUpdate(id, {
          $pull: { favourites: bookid },
        });
      }

      return res.status(200).json({ message: "Book removed from favourites" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

//all-favourite books
router.get("/get-all-fav-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const favBook = await User.findById(id).populate("favourites");
    if (favBook) {
      return res
        .status(200)
        .json({ status: "success", data: favBook.favourites });
    }
    return res.status(500).json({ message: "No favourite books found" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "error occurs" });
  }
});

module.exports = router;
