// Init app
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
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

// Bind routes
app.use("/expenses", require("./routes/spending"));
app.use("/auth", require("./routes/auth"));

// Serve HTML and CSS
app.use(express.static(path.join(__dirname, "public")));

// Start server
app.listen(port || process.env.PORT);
