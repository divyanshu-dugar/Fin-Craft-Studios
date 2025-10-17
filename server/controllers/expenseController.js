const Expense = require('../models/Expense');
const ExpenseCategory = require('../models/ExpenseCategory');
const mongoose = require('mongoose');

/**
 * Helper: Resolve category input (either ObjectId string or category name)
 */
async function resolveCategory(categoryInput) {
  if (!categoryInput) return null;

  // If ObjectId-like, check existence
  if (mongoose.Types.ObjectId.isValid(String(categoryInput))) {
    const cat = await ExpenseCategory.findById(String(categoryInput));
    if (cat) return cat._id;
  }

  // Otherwise, treat input as a name (case-insensitive)
  const name = String(categoryInput).trim();
  if (!name) return null;

  const existing = await ExpenseCategory.findOne({
    name: { $regex: `^${escapeRegExp(name)}$`, $options: 'i' },
  });

  // If category exists, return it
  if (existing) return existing._id;

  // If not, create new category with default color/icon
  const newCat = new ExpenseCategory({
    name,
    color: '#9CA3AF', // default grey
    icon: '💰',        // default icon
  });
  await newCat.save();
  return newCat._id;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* =============================
   GET ALL EXPENSES (user-specific)
============================= */
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .populate('category', 'name color icon')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   GET EXPENSE BY ID
============================= */
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('category', 'name color icon');

    if (!expense)
      return res.status(404).json({ message: 'Expense not found' });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   ADD NEW EXPENSE
============================= */
exports.addExpense = async (req, res) => {
  try {
    const { date, category, amount, note } = req.body;

    if (!date || amount == null) {
      return res.status(400).json({ message: 'Date and amount are required' });
    }

    if (isNaN(Number(amount))) {
      return res.status(400).json({ message: 'Amount must be a number' });
    }

    const categoryId = await resolveCategory(category);
    if (!categoryId) {
      return res.status(400).json({ message: 'Invalid or empty category' });
    }

    const parsedDate = new Date(req.body.date);
    const expense = new Expense({
      user: req.user._id,
      date: parsedDate,
      category: categoryId,
      amount,
      note,
    });

    await expense.save();
    await expense.populate('category', 'name color icon');

    res.status(201).json({
      message: 'Expense created successfully',
      expense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   UPDATE EXPENSE
============================= */
exports.editExpense = async (req, res) => {
  try {
    const { date, category, amount, note } = req.body;

    let categoryId;
    if (category) {
      categoryId = await resolveCategory(category);
      if (!categoryId)
        return res.status(400).json({ message: 'Invalid category' });
    }

    const updateObj = { date, amount, note };
    if (categoryId) updateObj.category = categoryId;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateObj,
      { new: true }
    ).populate('category', 'name color icon');

    if (!expense)
      return res.status(404).json({ message: 'Expense not found' });

    res.json({
      message: 'Expense updated successfully',
      expense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   DELETE EXPENSE
============================= */
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense)
      return res.status(404).json({ message: 'Expense not found' });

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   GET EXPENSES BY CATEGORY
============================= */
exports.getExpensesByCategory = async (req, res) => {
  try {
    const categoryParam = req.params.category;
    if (!categoryParam)
      return res.status(400).json({ message: 'Category parameter required' });

    const categoryId = await resolveCategory(categoryParam);
    if (!categoryId) return res.json([]);

    const expenses = await Expense.find({
      user: req.user._id,
      category: categoryId,
    })
      .populate('category', 'name color icon')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   GET EXPENSES BY DATE RANGE
============================= */
exports.getExpensesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate)
      return res.status(400).json({ message: 'startDate and endDate required' });

    const start = new Date(startDate);
    const end = new Date(endDate);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: start, $lte: end },
    })
      .populate('category', 'name color icon')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   GET EXPENSE STATS
============================= */
exports.getExpenseStats = async (req, res) => {
  try {
    if (!req.user || !req.user._id)
      return res.status(401).json({ error: 'Unauthorized' });

    const userId = new mongoose.Types.ObjectId(req.user._id);

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

    const populatedStats = await Promise.all(
      categoryStats.map(async (stat) => {
        const category = await ExpenseCategory.findById(stat._id);
        return {
          category: category
            ? { _id: category._id, name: category.name, color: category.color, icon: category.icon }
            : { _id: null, name: 'Unknown', color: '#9CA3AF', icon: '❓' },
          totalAmount: stat.totalAmount,
          count: stat.count,
        };
      })
    );

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

    res.json({
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

/* =============================
   GET EXPENSES BY CATEGORY + DATE RANGE
============================= */
exports.getExpensesByCategoryAndDateRange = async (req, res) => {
  try {
    const { category } = req.params;
    const { startDate, endDate } = req.query;

    if (!category)
      return res.status(400).json({ message: 'Category parameter required' });

    if (!startDate || !endDate)
      return res.status(400).json({ message: 'startDate and endDate required' });

    const categoryId = await resolveCategory(category);
    if (!categoryId) return res.json([]);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const expenses = await Expense.find({
      user: req.user._id,
      category: categoryId,
      date: { $gte: start, $lte: end },
    })
      .populate('category', 'name color icon')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
