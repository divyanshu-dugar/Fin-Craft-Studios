const express = require('express');
const {
  getExpenseCategories,
  addExpenseCategory,
  deleteExpenseCategory
} = require('../controllers/expenseCategoryController');

const router = express.Router();

// GET all categories
router.get('/', getExpenseCategories);

// POST new category
router.post('/', addExpenseCategory);

// DELETE category by id
router.delete('/:id', deleteExpenseCategory);

module.exports = router;
