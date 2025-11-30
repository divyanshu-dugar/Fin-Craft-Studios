const mongoose = require('mongoose');

const budgetAlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    budget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        required: true
    },
    type: {
        type: String,
        enum: ['threshold_reached', 'budget_exceeded', 'budget_almost_exceeded'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    currentSpent: {
        type: Number,
        required: true
    },
    budgetAmount: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BudgetAlert', budgetAlertSchema);