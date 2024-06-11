/**
 * Route file for managing CRUD operations on the drinks table
 * By Andreas Nygård
 */

// Requires
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");

// Connect to database
const db = new sqlite3.Database(process.env.DATABASE);

// Middleware
router.use(bodyParser.json());

// Validate user authorization
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
    if (err) {
      return res.status(403).json({ message: "Invalid JWT" });
    }
    req.username = username;
    next();
  });
}

//Get all drinks
router.get("/drinks", async (req, res) => {
  try {
    const sql = `SELECT * FROM drinks`;
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

//Get drink by ID
router.get("/drink/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const sql = `SELECT * FROM drinks WHERE id=?`;
    db.get(sql, [menuId], (err, row) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        if (!row) {
          res.status(404).json({ error: "Course not found" });
        } else {
          res.status(200).json(row);
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Add new course
router.post("/drinks", authenticateToken, async (req, res) => {
  try {
    const { drinkname, description, price } = req.body;

    // Check if any field is empty
    if (!drinkname || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if drink with the same details already exists
    const checkIfExistsSql = `SELECT * FROM drinks WHERE drinkname=? AND description=? AND price=?`;
    db.get(
      checkIfExistsSql,
      [drinkname, description, price],
      (err, existingMenu) => {
        if (err) {
          res.status(500).json({ error: "Server error" });
        } else if (existingMenu) {
          res
            .status(400)
            .json({ error: "Drink with the same details already exists" });
        } else {
          // Insert values intu table courses
          const insertSql = `INSERT INTO drinks (drinkname, description, price) VALUES (?,?,?)`;
          db.run(insertSql, [drinkname, description, price], (err) => {
            if (err) {
              res.status(500).json({ error: "Server error" });
            } else {
              res.status(201).json({ message: "Drink added successfully" });
            }
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Update drink
router.put("/drinks/:id", authenticateToken, async (req, res) => {
  try {
    const drinkId = req.params.id;
    const { drinkname, description, price } = req.body;

    //Update drink details in the database
    const sql = `UPDATE drinks SET drinkname=?, description=?, price=? WHERE id=?`;
    db.run(sql, [drinkname, description, price, drinkId], (err) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ message: "Drink updated successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Delete drink
router.delete("/drinks/:id", authenticateToken, async (req, res) => {
  try {
    const drinkId = req.params.id;
    const sql = `DELETE FROM drinks WHERE id=?`;
    db.run(sql, [drinkId], (err) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ message: "Drink deleted successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Export router object
module.exports = router;
