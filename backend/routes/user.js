const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./userAuth.js");

// Signup
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Check username length is more than 3
    if (username.length < 4) {
      return res.status(400).json({
        message: "Username length should be greater than 3",
        success: false,
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({
        message: "User  already exists",
        success: false,
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // Check password's length
    if (password.length <= 5) {
      return res.status(400).json({
        message: "Password should be greater than 5",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // Creating user
    const user = new User({
      username: username,
      email: email,
      password: hashPassword,
      address: address,
    });
    await user.save();

    return res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Login
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(500).json({
        message: "Invalid User",
        success: false,
      });
    }
    await bcrypt.compare(password, existingUser.password, (errz, data) => {
      if (data) {
        const authClames = [
          { name: existingUser.username },
          { role: existingUser.role },
        ];
        const token = jwt.sign({ authClames }, "bookStore123", {
          expiresIn: "30d",
        });
        res.status(200).json({
          id: existingUser._id,
          role: existingUser.role,
          token: token,
        });
      } else {
        res.status(400).json({
          message: "Invalid Credential",
        });
      }
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get-user-information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    const data = await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
