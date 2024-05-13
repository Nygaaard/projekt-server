/*
Routes for registration and login
By Andreas Nygård
*/

//Requires
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const bcrypt = require("bcrypt");

//Connect to database
const db = new sqlite3.Database(process.env.DATABASE);

//Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register user
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, username, password } = req.body;

    //Validate input
    //Firstname
    if (!firstname) {
      return res.status(400).json({
        error: "Firstname is required",
      });
    }
    //Lastname
    if (!lastname) {
      return res.status(400).json({
        error: "Lastname is required",
      });
    }
    //Email
    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }
    //Username
    if (!username) {
      return res.status(400).json({
        error: "Username is required",
      });
    }
    //Password
    if (!password) {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    //Validate username length
    if (username.length < 5) {
      return res.status(400).json({
        error: "Invalid username - must be at least 5 characters long.",
      });
    }
    //Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        error: "Invalid password - must be at least 8 characters long",
      });
    }
    //Validate email with Regex
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Check if user already exists
    const sqlCheckUsername = "SELECT * FROM users WHERE username = ?";
    db.get(sqlCheckUsername, [username], (err, usernameRow) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }
      if (usernameRow) {
        return res.status(400).json({ error: "Username already exists" });
      }

      //Check if email already exists
      const sqlCheckEmail = "SELECT * FROM users WHERE email = ?";
      db.get(sqlCheckEmail, [email], (err, emailRow) => {
        if (err) {
          return res.status(500).json({ error: "Server error" });
        }
        if (emailRow) {
          return res.status(400).json({ error: "Email already exists" });
        }

        // If correct information - save user
        const sql = `INSERT INTO users(firstname, lastname, email, username, password) VALUES(?, ?, ?, ?, ?)`;
        db.run(
          sql,
          [firstname, lastname, email, username, hashedPassword],
          (err) => {
            if (err) {
              return res.status(400).json({ message: "Error creating user" });
            } else {
              return res.status(201).json({ message: "User created" });
            }
          }
        );
      });
    });
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
