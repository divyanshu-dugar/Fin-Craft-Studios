const ExpenseCategory = require('../models/ExpenseCategory');

// Get all categories
const getExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new category
const addExpenseCategory = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const existing = await ExpenseCategory.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const category = new ExpenseCategory({ name, icon, color });
    await category.save();
    res.status(201).json({ message: 'Expense category created successfully', category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete expense category
const deleteExpenseCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getExpenseCategories,
  addExpenseCategory,
  deleteExpenseCategory
};
