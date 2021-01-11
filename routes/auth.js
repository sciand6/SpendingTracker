const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/authenticateUser");

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
            const token = jwt.sign({ _id: user._id }, process.env.JWTSecret);
            res.json({ token, user: { username, email } });
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
        return res.status(400).json({ msg: "Invalid email or password." });
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

// Reset password
router.put("/resetPassword", authenticateUser, (req, res) => {
  const { password, email } = req.body;

  // Input validation
  if (!password) {
    return res.status(400).json({ msg: "Please submit a valid password." });
  }

  // Find the user to update
  User.findOne({ email: email }).then((savedUser) => {
    // Hash password
    bcrypt
      .hash(password, 12)
      .then((hashedPwd) => {
        savedUser.password = hashedPwd;
        // Save user in db
        savedUser
          .save()
          .then((user) => {
            res.json({ success: "Password reset successful." });
          })
          .catch((err) => {
            return res.status(400).json({ msg: err });
          });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ msg: "There is no user with this email address." });
      });
  });
});

module.exports = router;
