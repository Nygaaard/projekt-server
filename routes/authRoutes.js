/*
Routes for registration and login
By Andreas Nygård
*/

const express = require("express");
const router = express.Router();

//Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register user
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, username, password } = req.body;

    //Validate input
    if (!firstname || !lastname || !email || !username || !password) {
      return res.status(400).json({ error: "Fill in all fields" });
    }
    //Validate username
    if (username.length < 5) {
      return res.status(400).json({
        error: "Invalid username - must be at least 5 characters long.",
      });
    }
    //Validate password
    if (password.length < 8) {
      return res.status(400).json({
        error: "Invalid password - must be at least 8 characters long",
      });
    }
    //Validate email with Regex
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    //If correct - save user
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Fill in all fields" });
    }
    //Validate username
    if (username.length < 5) {
      return res.status(400).json({
        error: "Invalid username - must be at least 5 characters long.",
      });
    }
    //Validate password
    if (password.length < 8) {
      return res.status(400).json({
        error: "Invalid password - must be at least 8 characters long",
      });
    }

    //Check credentials
    if (username === "Skanjar" && password === "password") {
      return res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid username/password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
