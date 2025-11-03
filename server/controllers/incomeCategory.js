const Category = require('../models/IncomeCategory');

const getIncomeCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addIncomeCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        res.status(201).json({ message: 'Category Created Successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getIncomeCategories, addIncomeCategory };
