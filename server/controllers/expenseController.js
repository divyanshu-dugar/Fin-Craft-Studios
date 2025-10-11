const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// Get all expenses for logged-in user
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
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
            user: req.user._id 
        });
        
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        
        res.json(expense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new expense for logged-in user
const addExpense = async (req, res) => {
    try {
        const { date, category, amount, note } = req.body;
        
        const expense = new Expense({ 
            user: req.user._id,
            date, 
            category, 
            amount, 
            note 
        });
        
        await expense.save();
        res.status(201).json({ 
            message: 'Expense Created Successfully',
            expense 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update expense (only if it belongs to the user)
const editExpense = async (req, res) => {
    try {
        const { date, category, amount, note } = req.body;
        
        const expense = await Expense.findOneAndUpdate(
            { 
                _id: req.params.id, 
                user: req.user._id 
            },
            { 
                date, 
                category, 
                amount, 
                note 
            },
            { new: true } // Return updated document
        );
        
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        
        res.status(200).json({ 
            message: 'Expense Updated Successfully',
            expense 
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
            user: req.user._id 
        });
        
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        
        res.status(200).json({ message: 'Expense Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get expenses by category for logged-in user
const getExpensesByCategory = async (req, res) => {
    try {
        const expenses = await Expense.find({ 
            user: req.user._id,
            category: req.params.category 
        }).sort({ date: -1 });
        
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get expenses within date range for logged-in user
const getExpensesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const expenses = await Expense.find({
            user: req.user._id,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ date: -1 });
        
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getExpenseStats = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Converting user._id to ObjectId explicitly
    const userId = new mongoose.Types.ObjectId(String(req.user._id));

    const matchStage = { $match: { user: userId } };

    // 1️⃣ Category-wise totals
    const categoryStats = await Expense.aggregate([
      matchStage,
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    // 2️⃣ Overall totals
    const totals = await Expense.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    const totalExpenses = totals.length > 0 ? totals[0].totalExpenses : 0;
    const totalTransactions = totals.length > 0 ? totals[0].totalTransactions : 0;
    const avgExpense = totalTransactions > 0 ? totalExpenses / totalTransactions : 0;

    res.status(200).json({
      categoryStats,
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
    getExpenseStats
};