const express = require('express');
const { getIncomes, getIncomeById, addIncome, editIncome, deleteIncome } = require('../controllers/income');

const router = express.Router();

router.get('/', getIncomes);
router.get('/:id', getIncomeById);
router.post('/', addIncome);
router.patch('/', editIncome);
router.delete('/:id', deleteIncome);

module.exports = router;
