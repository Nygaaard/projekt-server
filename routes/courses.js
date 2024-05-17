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
router.get("/courses", async (req, res) => {
  try {
    const sql = `SELECT * FROM courses`;
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
router.get("/courses/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const sql = `SELECT * FROM courses WHERE id=?`;
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

//Add new menu
router.post("/courses", async (req, res) => {
  try {
    const { coursename, category, price, description } = req.body;

    // Check if any field is empty
    if (!coursename || !category || !price || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if menu with the same details already exists
    const checkIfExistsSql = `SELECT * FROM courses WHERE coursename=? AND category=? AND price=? AND description=?`;
    db.get(
      checkIfExistsSql,
      [coursename, category, price, description],
      (err, existingMenu) => {
        if (err) {
          res.status(500).json({ error: "Server error" });
        } else if (existingMenu) {
          res
            .status(400)
            .json({ error: "Course with the same details already exists" });
        } else {
          // Insert values intu table menu
          const insertSql = `INSERT INTO courses (coursename, category, price, description) VALUES (?,?,?,?)`;
          db.run(
            insertSql,
            [coursename, category, price, description],
            (err) => {
              if (err) {
                res.status(500).json({ error: "Server error" });
              } else {
                res.status(201).json({ message: "Course added successfully" });
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

//Update menu
router.put("/courses/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const { coursename, category, price, description } = req.body;

    //Update menu details in the database
    const sql = `UPDATE courses SET coursename=?, category=?, price=?, description=? WHERE id=?`;
    db.run(sql, [coursename, category, price, description, menuId], (err) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ message: "Course updated successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Delete menu
router.delete("/courses/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const sql = `DELETE FROM courses WHERE id=?`;
    db.run(sql, [menuId], (err) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ message: "Course deleted successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Export router object
module.exports = router;
