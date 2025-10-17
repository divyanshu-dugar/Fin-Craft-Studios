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
const passport = require("passport")

// All routes are protected
router.get('/', passport.authenticate('jwt', { session: false }), getExpenses);
router.get('/stats', passport.authenticate('jwt', { session: false }), getExpenseStats);
router.get('/category/:category', passport.authenticate('jwt', { session: false }), getExpensesByCategory);
router.get('/date-range', passport.authenticate('jwt', { session: false }), getExpensesByDateRange);
router.get('/category/:category/date-range', passport.authenticate('jwt', { session: false }), getExpensesByCategoryAndDateRange); 
router.get('/:id', passport.authenticate('jwt', { session: false }), getExpenseById);
router.post('/', passport.authenticate('jwt', { session: false }), addExpense);
router.put('/:id', passport.authenticate('jwt', { session: false }), editExpense);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteExpense);

module.exports = router;