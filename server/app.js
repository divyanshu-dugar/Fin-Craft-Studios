const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const expense = require('./routes/expense');
const expenseCategory = require('./routes/expenseCategory');

const income = require('./routes/income');
const incomeCategory = require('./routes/incomeCategory');
const savingsGoalList = require('./routes/savingsGoalList');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'https://ledgerify-client.vercel.app', 'https://fincraft-studios.vercel.app'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 
app.get('/', (req, res) => {
    res.send("Server running!")
})

app.use('/expenses', expense);
app.use('/expense-categories', expenseCategory);
app.use('/income', income);
app.use('/income-categories', incomeCategory);
app.use('/saving-goals', savingsGoalList);

module.exports = app;
