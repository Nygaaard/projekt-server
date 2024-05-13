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

//Use express and body-parser
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

//Routes
app.use("/api", authRoutes);

//Start application
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
