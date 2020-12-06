const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  day: Date,
  category: String,
  price: Number,
});

module.exports = Expense = mongoose.model("Expense", ExpenseSchema);
