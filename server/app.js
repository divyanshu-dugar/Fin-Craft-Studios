const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'https://ledgerify-client.vercel.app/'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/expenses', expenseRoutes);
app.use('/categories', categoryRoutes);

module.exports = app;
