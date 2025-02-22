const express = require('express');
const { getIncomeCategories, addIncomeCategory } = require('../controllers/incomeCategoryController');

const router = express.Router();

router.get('/', getIncomeCategories);
router.post('/', addIncomeCategory);

module.exports = router;
