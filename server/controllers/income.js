const Income = require('../models/Income');

const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({});
        res.json(incomes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getIncomeById = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        res.json(income);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addIncome = async (req, res) => {
    try {
        const { date, category, amount, note } = req.body;
        const income = new Income({ date, category, amount, note });
        await income.save();
        res.status(201).json({ message: 'Income Created Successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const editIncome = async (req, res) => {
    try {
        const { _id, date, category, amount, note } = req.body;
        await Income.updateOne({ _id }, { date, category, amount, note });
        res.status(200).json({ message: 'Income Updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteIncome = async (req, res) => {
    try {
        await Income.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Income Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getIncomes, getIncomeById, addIncome, editIncome, deleteIncome };
