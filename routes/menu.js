/**
 * Route file for managing CRUD operations on the menu table
 * By Andreas Nygård
 */

// Requires
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();

// Connect to database
const db = new sqlite3.Database(process.env.DATABASE);

// Middleware
router.use(bodyParser.json());

//Get all menus
router.get("/menu", async (req, res) => {
  try {
    const sql = `SELECT * FROM menu`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ menu: rows });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Get menu by ID
router.get("/menu/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const sql = `SELECT * FROM menu WHERE id=?`;
    db.get(sql, [menuId], (err, row) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        if (!row) {
          res.status(404).json({ error: "Menu not found" });
        } else {
          res.status(200).json(row);
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Add new menu
router.post("/menu", async (req, res) => {
  try {
    const { coursename, category, price, description } = req.body;

    // Check if any field is empty
    if (!coursename || !category || !price || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if menu with the same details already exists
    const checkIfExistsSql = `SELECT * FROM menu WHERE coursename=? AND category=? AND price=? AND description=?`;
    db.get(
      checkIfExistsSql,
      [coursename, category, price, description],
      (err, existingMenu) => {
        if (err) {
          res.status(500).json({ error: "Server error" });
        } else if (existingMenu) {
          res
            .status(400)
            .json({ error: "Menu with the same details already exists" });
        } else {
          // Insert values intu table menu
          const insertSql = `INSERT INTO menu (coursename, category, price, description) VALUES (?,?,?,?)`;
          db.run(
            insertSql,
            [coursename, category, price, description],
            (err) => {
              if (err) {
                res.status(500).json({ error: "Server error" });
              } else {
                res.status(201).json({ message: "Menu added successfully" });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Export router object
module.exports = router;
