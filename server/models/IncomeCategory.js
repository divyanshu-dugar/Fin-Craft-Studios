// models/ExpenseCategory.js
const mongoose = require('mongoose');

const incomeCategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // 👈 each category belongs to a user
  },
  name: { type: String, required: true },
  icon: { type: String, default: '💰' },
  color: { type: String, default: '#9CA3AF' }
}, {
  timestamps: true
});

// Ensure category names are unique per user (not globally)
incomeCategorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('IncomeCategory', incomeCategorySchema);
