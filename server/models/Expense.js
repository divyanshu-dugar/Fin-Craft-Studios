const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: { type: Date, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpenseCategory', // 👈 reference to ExpenseCategory model
    required: true
  },
  amount: { type: Number, required: true },
  note: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model("Expense", expenseSchema);
