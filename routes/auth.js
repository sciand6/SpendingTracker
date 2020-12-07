const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign up
router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please submit all required fields." });
  }

  // Check if user already exists
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(400)
        .json({ msg: "User with this email already exists." });
    }

    // Hash password
    bcrypt
      .hash(password, 12)
      .then((hashedPwd) => {
        const user = new User({
          username: username,
          email: email,
          password: hashedPwd,
        });
        // Save user in db
        user
          .save()
          .then((user) => {
            res.json({
              success: `User ${user.username} registration successful.`,
            });
          })
          .catch((err) => {
            return res.status(400).json({ msg: err });
          });
      })
      .catch((err) => {
        return res.status(400).json({ msg: err });
      });
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Input validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide an email and password." });
  }

  // Check if user exists
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.json({ msg: "Invalid email or password." });
      }

      bcrypt.compare(password, savedUser.password).then((pwMatch) => {
        if (pwMatch) {
          // Generate a token based off user id
          const token = jwt.sign({ _id: savedUser._id }, process.env.JWTSecret);
          // Send token and user info as response
          const { username, email } = savedUser;
          res.json({ token, user: { username, email } });
        } else {
          return res.status(400).json({ msg: "Invalid email or password." });
        }
      });
    })
    .catch((err) => {
      return res.status(400).json({ msg: err });
    });
});

module.exports = router;
