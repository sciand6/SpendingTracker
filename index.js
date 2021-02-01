// Initialize app
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

// Configuration
app.use(express.json());
app.use(cors());

// Connect to mongoDB
mongoose.connect(process.env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Bind mongoDB connection error msg
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Welcome route
app.get("/", (req, res) => {
  res.send("Spent It API V1");
});

// Bind routes
app.use("/expenses", require("./routes/spending"));
app.use("/auth", require("./routes/auth"));

// Serve HTML through the views folder
app.set("view engine", "ejs");

// Start server
app.listen(process.env.PORT || 5000);
