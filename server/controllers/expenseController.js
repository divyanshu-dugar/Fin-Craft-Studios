const Expense = require('../models/Expense');
const ExpenseCategory = require('../models/ExpenseCategory');
const mongoose = require('mongoose');

/**
 * Helper: Resolve category input (either ObjectId string or category name)
 * - If value is a valid ObjectId and exists => return that id
 * - If value is a string name => find existing category by name (case-insensitive)
 *   - if found => return its id
 *   - if not found => create a new category and return its id
 */
async function resolveCategory(categoryInput) {
  if (!categoryInput) return null;

  // If ObjectId-like, check existence
  if (mongoose.Types.ObjectId.isValid(String(categoryInput))) {
    const cat = await ExpenseCategory.findById(String(categoryInput));
    if (cat) return cat._id;
    // If it looked like an ObjectId but doesn't exist, we treat as invalid below
  }

  // Otherwise treat input as name (string)
  const name = String(categoryInput).trim();
  if (!name) return null;

  // Case-insensitive search
  let existing = await ExpenseCategory.findOne({ name: { $regex: `^${escapeRegExp(name)}$`, $options: 'i' } });
  if (existing) return existing._id;

  // Create new category (default color can be set or randomized)
  const newCat = new ExpenseCategory({ name });
  await newCat.save();
  return newCat._id;
}

// small helper to escape regex special chars from name
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get all expenses for logged-in user (with populated category)
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .populate('category', 'name color icon')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get expense by ID (only if it belongs to the user)
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('category', 'name color icon');

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new expense for logged-in user
const addExpense = async (req, res) => {
  try {
    const { date, category, amount, note } = req.body;

    // Basic validation
    if (!date || amount == null) {
      return res.status(400).json({ message: 'Date and amount are required' });
    }
    if (isNaN(Number(amount))) {
      return res.status(400).json({ message: 'Amount must be a number' });
    }

    // Resolve category (id or name)
    const categoryId = await resolveCategory(category);
    if (!categoryId) {
      return res.status(400).json({ message: 'Invalid or empty category' });
    }

    const expense = new Expense({
      user: req.user._id,
      date,
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

// Update expense (only if it belongs to the user)
const editExpense = async (req, res) => {
  try {
    const { date, category, amount, note } = req.body;

    // If category provided, resolve it
    let categoryId = undefined;
    if (category !== undefined) {
      categoryId = await resolveCategory(category);
      if (!categoryId) {
        return res.status(400).json({ message: 'Invalid or empty category' });
      }
    }

    const updateObj = { date, amount, note };
    if (categoryId) updateObj.category = categoryId;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateObj,
      { new: true }
    ).populate('category', 'name color icon');

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.status(200).json({
      message: 'Expense updated successfully',
      expense,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete expense (only if it belongs to the user)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get expenses by category (accepts either category id or name)
const getExpensesByCategory = async (req, res) => {
  try {
    const param = req.params.categoryId || req.params.category || req.params.id; // be flexible
    if (!param) return res.status(400).json({ message: 'Category parameter required' });

    // If param is an ObjectId, use it. Otherwise try to resolve name to id
    let categoryId = null;
    if (mongoose.Types.ObjectId.isValid(String(param))) {
      const cat = await ExpenseCategory.findById(String(param));
      if (cat) categoryId = cat._id;
      // if not found, we'll attempt name-based fallback
    }

    if (!categoryId) {
      // try name-to-id mapping (case-insensitive)
      const catByName = await ExpenseCategory.findOne({ name: { $regex: `^${escapeRegExp(String(param).trim())}$`, $options: 'i' } });
      if (catByName) categoryId = catByName._id;
    }

    if (!categoryId) {
      // If still not found, respond with empty list or 404 — choose empty list for UX
      return res.json([]);
    }

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

// Get expenses within date range
const getExpensesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ message: 'startDate and endDate are required' });

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) return res.status(400).json({ message: 'Invalid date range' });

    const expenses = await Expense.find({
      user: req.user._id,
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .populate('category', 'name color icon')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const ExpenseCategory = require('../models/ExpenseCategory');

const getExpenseStats = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Aggregate stats per category (using ObjectId reference)
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

    // Populate category names and colors
    const populatedStats = await Promise.all(
      categoryStats.map(async (stat) => {
        const category = await ExpenseCategory.findById(stat._id);
        return {
          category: category
            ? { _id: category._id, name: category.name, color: category.color }
            : { _id: null, name: 'Unknown', color: '#9CA3AF' },
          totalAmount: stat.totalAmount,
          count: stat.count,
        };
      })
    );

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

module.exports = getExpenseStats;

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
