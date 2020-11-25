// Init app
const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const mongoose = require('mongoose');
require('dotenv').config()

// Configuration
app.use(express.json());

// Connect to mongoDB
mongoose.connect(process.env.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

// Bind mongoDB connection error msg
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Bind routes
app.use('/expenses', require('./routes/spending'));

// Serve HTML and CSS
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(port);