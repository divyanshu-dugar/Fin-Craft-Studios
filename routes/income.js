const express = require('express');
const router = express.Router();
const {
    getIncomes,
    getIncomeById,
    addIncome,
    editIncome,
    deleteIncome,
    getIncomesByCategory,
    getIncomeStats,
    getIncomesByCategoryAndDateRange
} = require('../controllers/income');
const passport = require("passport")

// All routes are protected
router.get('/', passport.authenticate('jwt', { session: false }), getIncomes);
router.get('/stats', passport.authenticate('jwt', { session: false }), getIncomeStats);
router.get('/category/:category', passport.authenticate('jwt', { session: false }), getIncomesByCategory);
router.get('/category/:category/date-range', passport.authenticate('jwt', { session: false }), getIncomesByCategoryAndDateRange); 
router.get('/:id', passport.authenticate('jwt', { session: false }), getIncomeById);
router.post('/', passport.authenticate('jwt', { session: false }), addIncome);
router.put('/:id', passport.authenticate('jwt', { session: false }), editIncome);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteIncome);

module.exports = router;