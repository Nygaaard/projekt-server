/**
 * Route file for managing CRUD operations on the admin_user table
 * By Andreas Nygård
 */

// Requires
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

// Connect to database
const db = new sqlite3.Database(process.env.DATABASE);

// Middleware
router.use(bodyParser.json());

// Get all users
router.get("/users", async (req, res) => {
  try {
    const sql = `SELECT * FROM admin_user`;
    db.all(sql, [], (err, row) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ users: row });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Get user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const sql = `SELECT * FROM admin_user WHERE id = ?`;
    db.get(sql, [userId], (err, row) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        if (!row) {
          res.status(404).json({ message: "User not found" });
        } else {
          res.status(200).json(row);
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Update user
router.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstname, lastname, email, username, password } = req.body;

    //Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Update user in database
    const sql = `UPDATE admin_user SET firstname=?, lastname=?, email=?, username=?, password=? WHERE id=?`;
    db.run(
      sql,
      [firstname, lastname, email, username, hashedPassword, userId],
      (err) => {
        if (err) {
          res.status(500).json({ error: "Server error" });
        } else {
          res.status(200).json({ message: "User updated successfully" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    //Delete user from database
    const sql = `DELETE FROM admin_user WHERE id=?`;
    db.run(sql, [userId], (err) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ message: "User deleted successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Export router object
module.exports = router;
