const express = require('express');
const { getExpenses, getExpenseById, addExpense, editExpense, deleteExpense } = require('../controllers/expenseController');

const router = express.Router();

router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', addExpense);
router.patch('/', editExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
