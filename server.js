/*
Express server setup for managing authentication routes and protected endpoints
By Andreas Nygård
*/

//Requires
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const adminUserRoutes = require("./routes/adminUser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

//Use express and body-parser
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

//Cors
app.use(cors());

//Routes
app.use("/api", authRoutes);
app.use("/api", adminUserRoutes);

//Protected route
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected route" });
});

//Validate token
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

//Start application
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
