/*
Applikation för registrering och inlogging
Innehåller även routes för CRUD
Av Andreas Nygård
*/

//Requires
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");

//Use express and body-parser
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

//Routes
app.use("/api", authRoutes);

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
