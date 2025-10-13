const mongoose = require('mongoose');

const expenseCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  color: { type: String } 
});

module.exports = mongoose.model('ExpenseCategory', expenseCategorySchema);
