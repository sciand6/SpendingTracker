const Expense = require("../models/expense");
const express = require("express");
mongo = require("mongodb");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");

// Get expenses
router.get("/getExpenses", authenticateUser, (req, res) => {
  Expense.find({ createdBy: req.user })
    .sort("-day")
    .then((data) => {
      let expenses = [];

      data.map((expense) => {
        expenses.push({
          _id: expense._id,
          day: expense.day,
          category: expense.category,
          price: expense.price,
        });
      });

      res.json(expenses);
    })
    .catch((err) => {
      return res.status(400).json({ msg: err });
    });
});

// Create expense
router.post("/createExpense", authenticateUser, (req, res) => {
  let { category, price, day } = req.body;

  // If there is no date specified, use the current date
  if (!day) {
    day = new Date();
  } else {
    // Otherwise, convert the date provided in request body to a date object
    day = new Date(day);
  }

  // Input validation
  if (!category || !price) {
    return res.status(400).json({ msg: "Enter a valid category and price." });
  }

  const expense = new Expense({
    day,
    category,
    price,
    createdBy: req.user,
  });

  expense
    .save()
    .then(() => {
      res.json({ success: "Expense saved successfully." });
    })
    .catch((err) => {
      return res.status(400).json({ msg: err });
    });
});

// Remove expense
router.delete("/deleteExpense/:id", authenticateUser, (req, res) => {
  const id = req.params.id;

  Expense.deleteOne({ _id: new mongo.ObjectId(id) }, (err, result) => {
    if (err) {
      res.json({ msg: "There was a problem deleting the expense." });
    }
  });

  res.json({ success: "Expense deleted successfully." });
});

// Edit expense
router.put("/editExpense/:id", authenticateUser, (req, res) => {
  const id = req.params.id;
  let { category, price, day } = req.body;

  Expense.findById(new mongo.ObjectId(id), (err, expense) => {
    if (err) {
      res
        .status(400)
        .json({ msg: "There was a problem updating that expense." });
    }

    expense.category = category;
    expense.price = price;
    expense.day = new Date(day);

    expense
      .save()
      .then(() => {
        res.json({ success: "Expense saved successfully." });
      })
      .catch((err) => {
        return res.status(400).json({ msg: err });
      });
  });
});

module.exports = router;
