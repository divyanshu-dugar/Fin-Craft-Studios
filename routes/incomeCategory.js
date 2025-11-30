const express = require('express');
const passport = require('passport');
const {
  getIncomeCategories,
  addIncomeCategory,
  deleteIncomeCategory
} = require('../controllers/incomeCategory');

const router = express.Router();

// GET all categories
router.get('/', passport.authenticate('jwt', { session: false }), getIncomeCategories);

// POST new category
router.post('/', passport.authenticate('jwt', { session: false }), addIncomeCategory);

// DELETE category by id
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteIncomeCategory);

module.exports = router;