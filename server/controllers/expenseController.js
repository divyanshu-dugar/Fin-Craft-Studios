const Expense = require('../models/Expense');

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({});
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        res.json(expense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addExpense = async (req, res) => {
    try {
        const { date, category, amount, note } = req.body;
        const expense = new Expense({ date, category, amount, note });
        await expense.save();
        res.status(201).json({ message: 'Expense Created Successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const editExpense = async (req, res) => {
    try {
        const { _id, date, category, amount, note } = req.body;
        await Expense.updateOne({ _id }, { date, category, amount, note });
        res.status(200).json({ message: 'Expense Updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        await Expense.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getExpenses, getExpenseById, addExpense, editExpense, deleteExpense };
