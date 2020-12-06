const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

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
            res.status(400).json({ msg: err });
          });
      })
      .catch((err) => {
        res.status(400).json({ msg: err });
      });
  });
});

module.exports = router;
