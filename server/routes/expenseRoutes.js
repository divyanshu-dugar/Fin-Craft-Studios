const express = require('express');
const router = express.Router();
const {
    getExpenses,
    getExpenseById,
    addExpense,
    editExpense,
    deleteExpense,
    getExpensesByCategory,
    getExpensesByDateRange,
    getExpenseStats
} = require('../controllers/expenseController');
const authenticate = require('../middleware/auth');

// All routes are protected
router.get('/', authenticate, getExpenses);
router.get('/stats', authenticate, getExpenseStats);
router.get('/category/:category', authenticate, getExpensesByCategory);
router.get('/date-range', authenticate, getExpensesByDateRange);
router.get('/:id', authenticate, getExpenseById);
router.post('/', authenticate, addExpense);
router.put('/:id', authenticate, editExpense);
router.delete('/:id', authenticate, deleteExpense);

module.exports = router;