const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const incomeCategoryRoutes = require('./routes/incomeCategoryRoutes');
const savingsGoalListRoutes = require('./routes/savingsGoalListRoutes');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'https://ledgerify-client.vercel.app/'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send("Server running!")
})

app.use('/expenses', expenseRoutes);
app.use('/income', incomeRoutes);
app.use('/categories', categoryRoutes);
app.use('/income-categories', incomeCategoryRoutes);
app.use('/saving-goals', savingsGoalListRoutes);

module.exports = app;
