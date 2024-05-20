/*
 * Route file for managing CRUD operations on the subscribers menu
 * By Andreas Nygård
 */

//Requires

const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();

// Connect to database
const db = new sqlite3.Database(process.env.DATABASE);

// Middleware
router.use(bodyParser.json());

//Get all subscribers
router.get("/subscribers", async (req, res) => {
  try {
    const sql = `SELECT * FROM subscribers`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ subscriber: rows });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Get subscriber by ID
router.get("/subscribers/:id", async (req, res) => {
  try {
    const subscriberId = req.params.id;
    const sql = `SELECT * FROM subscribers WHERE id=?`;
    db.get(sql, [subscriberId], (err, row) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        if (!row) {
          res.status(404).json({ error: "Subscriber not found" });
        } else {
          res.status(200).json(row);
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Add new subscriber
router.post("/subscribers", async (req, res) => {
  try {
    const { firstname, lastname, email, address } = req.body;

    // Check if any field is empty
    if (!firstname || !lastname || !email || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if subscriber with the same details already exists
    const checkIfExistsSql = `SELECT * FROM subscribers WHERE firstname=? AND lastname=? AND email=? AND address=?`;
    db.get(
      checkIfExistsSql,
      [firstname, lastname, email, address],
      (err, existingSubscriber) => {
        if (err) {
          res.status(500).json({ error: "Server error" });
        } else if (existingSubscriber) {
          res
            .status(400)
            .json({ error: "Subscriber with the same details already exists" });
        } else {
          // Insert values intu table subscribers
          const insertSql = `INSERT INTO subscribers (firstname, lastname, email, address) VALUES (?,?,?,?)`;
          db.run(insertSql, [firstname, lastname, email, address], (err) => {
            if (err) {
              res.status(500).json({ error: "Server error" });
            } else {
              res
                .status(201)
                .json({ message: "Subscriber added successfully" });
            }
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Update subscriber
router.put("/subscribers/:id", async (req, res) => {
  try {
    const subscriberId = req.params.id;
    const { firstname, lastname, email, address } = req.body;

    //Update subscriber details in the database
    const sql = `UPDATE subscribers SET firstname=?, lastname=?, email=?, address=? WHERE id=?`;
    db.run(sql, [firstname, lastname, email, address, subscriberId], (err) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ message: "Subscriber updated successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Delete subscriber
router.delete("/subscribers/:id", async (req, res) => {
  try {
    const subscriberId = req.params.id;
    const sql = `DELETE FROM subscribers WHERE id=?`;
    db.run(sql, [subscriberId], (err) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ message: "Subscriber deleted successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Export router object
module.exports = router;
