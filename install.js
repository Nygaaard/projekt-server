/**
 Installation file for sqlite3 database
 By Andreas Nygård
 */

require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

//Connect to database
const db = new sqlite3.Database(process.env.DATABASE);

//Create tables
db.serialize(() => {
  //Drop tables if exists
  db.run("DROP TABLE IF EXISTS courses");
  db.run("DROP TABLE IF EXISTS drinks");
  db.run("DROP TABLE IF EXISTS admin_user");

  //Create table menu
  db.run(`CREATE TABLE courses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coursename VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP 
    )`);

  //Create table drinks
  db.run(`CREATE TABLE drinks(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drinkname VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      price INTEGER NOT NULL,
      created DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

  //Create table users
  db.run(`CREATE TABLE admin_user(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname VARCHAR(50) NOT NULL,
        lastname VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

  console.log("Tables created...");
});
