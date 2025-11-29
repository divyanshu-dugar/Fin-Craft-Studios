const IncomeCategory = require('../models/IncomeCategory');

// Get all categories for a specific user
exports.getIncomeCategories = async (req, res) => {
  try {
    const categories = await IncomeCategory.find({ user: req.user._id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new category for the logged-in user
exports.addIncomeCategory = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const existing = await IncomeCategory.findOne({
      user: req.user._id,
      name: name.trim(),
    });

    if (existing)
      return res.status(400).json({ message: 'Category already exists' });

    const category = new IncomeCategory({
      user: req.user._id,
      name: name.trim(),
      icon,
      color,
    });

    await category.save();
    res.status(201).json({
      message: 'Income category created successfully',
      category,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete income category
exports.deleteIncomeCategory = async (req, res) => {
  try {
    const category = await IncomeCategory.findOneAndDelete({
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