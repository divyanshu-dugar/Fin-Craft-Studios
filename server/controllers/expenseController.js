const Expense = require('../models/Expense');
const ExpenseCategory = require('../models/ExpenseCategory');
const mongoose = require('mongoose');

// 🟢 Get all expenses for logged-in user (with populated category)
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .populate('category', 'name') // ✅ populate category name
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get expense by ID (only if it belongs to the user)
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('category', 'name');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Add new expense for logged-in user
const addExpense = async (req, res) => {
  try {
    const { date, category, amount, note } = req.body;

    // ✅ Validate referenced category exists
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    const categoryExists = await ExpenseCategory.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const expense = new Expense({
      user: req.user._id,
      date,
      category,
      amount,
      note,
    });

    await expense.save();

    // populate before sending response
    await expense.populate('category', 'name');

    res.status(201).json({
      message: 'Expense created successfully',
      expense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Update expense (only if it belongs to the user)
const editExpense = async (req, res) => {
  try {
    const { date, category, amount, note } = req.body;

    // ✅ Optional category validation
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { date, category, amount, note },
      { new: true }
    ).populate('category', 'name');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({
      message: 'Expense updated successfully',
      expense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Delete expense (only if it belongs to the user)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get expenses by category (category = ObjectId)
const getExpensesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const expenses = await Expense.find({
      user: req.user._id,
      category: categoryId,
    })
      .populate('category', 'name')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get expenses within date range
const getExpensesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const expenses = await Expense.find({
      user: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate('category', 'name')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get expense stats (category-wise totals)
const getExpenseStats = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Category-wise totals
    const categoryStats = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    // Populate category names in aggregation
    const populatedStats = await ExpenseCategory.populate(categoryStats, {
      path: '_id',
      select: 'name',
    });

    // Overall totals
    const totals = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    const totalExpenses = totals[0]?.totalExpenses || 0;
    const totalTransactions = totals[0]?.totalTransactions || 0;
    const avgExpense = totalTransactions ? totalExpenses / totalTransactions : 0;

    res.status(200).json({
      categoryStats: populatedStats,
      totalExpenses,
      totalTransactions,
      avgExpense,
    });
  } catch (err) {
    console.error('Error getting expense stats:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  addExpense,
  editExpense,
  deleteExpense,
  getExpensesByCategory,
  getExpensesByDateRange,
  getExpenseStats,
};
