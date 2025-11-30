const express = require('express');
const passport = require('passport');
const {
  getExpenseCategories,
  addExpenseCategory,
  deleteExpenseCategory
} = require('../controllers/expenseCategory');

const router = express.Router();

// GET all categories
router.get('/', passport.authenticate('jwt', { session: false }), getExpenseCategories);

// POST new category
router.post('/', passport.authenticate('jwt', { session: false }), addExpenseCategory);

// DELETE category by id
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteExpenseCategory);

module.exports = router;
