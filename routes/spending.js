const Expense = require("../models/expense");
const express = require("express");
mongo = require("mongodb");
const router = express.Router();

// Get expenses
router.get("/getExpenses", (req, res) => {
  Expense.find((err, expenses) => {
    if (err) {
      return res.status(400).json({
        msg: "Couldn't find any expenses. Have you tried adding one?",
      });
    }

    res.json(expenses);
  });
});

// Create expense
router.post("/createExpense", (req, res) => {
  const { category, price } = req.body;
  var day = new Date();
  day.setHours(0, 0, 0, 0);

  // Input validation
  if (
    !category ||
    !price ||
    typeof category != "string" ||
    typeof price != "number"
  ) {
    return res.status(400).json({ msg: "Enter a valid category and price." });
  }

  const expense = new Expense({
    day,
    category,
    price,
  });

  expense.save((err) => {
    if (err) {
      return res
        .status(400)
        .json({ msg: "There was a problem creating the expense." });
    }
  });

  res.json({ success: "Expense saved successfully." });
});

// Remove expense
router.delete("/deleteExpense/:id", (req, res) => {
  const id = req.params.id;

  Expense.deleteOne({ _id: new mongo.ObjectId(id) }, (err, result) => {
    if (err) {
      res.json({ msg: "There was a problem deleting the expense." });
    }
  });

  res.json({ success: "Expense deleted successfully." });
});

module.exports = router;
