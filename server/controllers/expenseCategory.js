const ExpenseCategory = require('../models/ExpenseCategory');

// Get all categories
// Get all categories for a specific user
const getExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find({ user: req.user._id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new category
// Add a new category for the logged-in user
const addExpenseCategory = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const existing = await ExpenseCategory.findOne({
      user: req.user._id,
      name: name.trim(),
    });

    if (existing)
      return res.status(400).json({ message: 'Category already exists' });

    const category = new ExpenseCategory({
      user: req.user._id,
      name: name.trim(),
      icon,
      color,
    });

    await category.save();
    res.status(201).json({
      message: 'Expense category created successfully',
      category,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete expense category
const deleteExpenseCategory = async (req, res) => {
  try {
    const category = await ExpenseCategory.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getExpenseCategories,
  addExpenseCategory,
  deleteExpenseCategory
};
