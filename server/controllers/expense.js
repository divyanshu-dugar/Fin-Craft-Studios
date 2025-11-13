const ExpenseCategory = require('../models/ExpenseCategory');
const Expense = require('../models/Expense'); // Import Expense to handle related expenses

/* =============================
   GET ALL CATEGORIES (user-specific)
============================= */
exports.getExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find({ user: req.user._id }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   ADD NEW CATEGORY (user-specific)
============================= */
exports.addExpenseCategory = async (req, res) => {
  try {
    const { name, color, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Check if category name already exists for this user
    const existingCategory = await ExpenseCategory.findOne({
      user: req.user._id,
      name: { $regex: `^${name.trim()}$`, $options: 'i' }
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const category = new ExpenseCategory({
      user: req.user._id,
      name: name.trim(),
      color: color || '#9CA3AF',
      icon: icon || '💰'
    });

    await category.save();
    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   UPDATE CATEGORY (user-specific)
============================= */
exports.editExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, icon } = req.body;

    // Find the category and verify it belongs to the current user
    const category = await ExpenseCategory.findOne({
      _id: id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // If name is being updated, check for uniqueness
    if (name && name.trim() !== category.name) {
      const existingCategory = await ExpenseCategory.findOne({
        user: req.user._id,
        name: { $regex: `^${name.trim()}$`, $options: 'i' },
        _id: { $ne: id } // Exclude current category
      });

      if (existingCategory) {
        return res.status(400).json({ message: 'Category name already exists' });
      }

      category.name = name.trim();
    }

    // Update other fields if provided
    if (color) category.color = color;
    if (icon) category.icon = icon;

    await category.save();
    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   DELETE CATEGORY (user-specific)
============================= */
exports.deleteExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category and verify it belongs to the current user
    const category = await ExpenseCategory.findOne({
      _id: id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category is being used by any expenses
    const expensesUsingCategory = await Expense.findOne({
      category: id,
      user: req.user._id
    });

    if (expensesUsingCategory) {
      return res.status(400).json({ 
        message: 'Cannot delete category. It is being used by one or more expenses.' 
      });
    }

    // Delete the category
    await ExpenseCategory.findByIdAndDelete(id);
    
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};