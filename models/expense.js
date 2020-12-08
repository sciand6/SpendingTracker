const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const ExpenseSchema = new Schema({
  day: Date,
  category: String,
  price: Number,
  createdBy: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = Expense = mongoose.model("Expense", ExpenseSchema);
