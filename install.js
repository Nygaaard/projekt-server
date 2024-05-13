/**
 Installation file for sqlite3 database
 By Andreas Nygård
 */

require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

//Connect to database
const db = new sqlite3.Database(process.env.DATABASE);

//Create table menu
db.serialize(() => {
  //Drop tables if exists
  db.run("DROP TABLE IF EXISTS menu");
  db.run("DROP TABLE IF EXISTS users");

  //Create table menu
  db.run(`CREATE TABLE menu(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coursename VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP 
    )`);

  //Create table users
  db.run(`CREATE TABLE users(
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
