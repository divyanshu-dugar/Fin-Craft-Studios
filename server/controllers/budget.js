const Budget = require('../models/Budget');
const BudgetAlert = require('../models/BudgetAlert');
const Expense = require('../models/Expense');
const ExpenseCategory = require('../models/ExpenseCategory');
const mongoose = require('mongoose');

/* =============================
   GET ALL BUDGETS (user-specific)
============================= */
/* =============================
   GET ALL BUDGETS (user-specific)
============================= */
exports.getBudgets = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const budgets = await Budget.find({ user: req.user._id })
            .populate('category', 'name color icon')
            .sort({ createdAt: -1 });

        // Calculate current spending for each budget
        const budgetsWithSpending = await Promise.all(
            budgets.map(async (budget) => {
                const currentSpent = await calculateBudgetSpending(budget);
                const percentage = (currentSpent / budget.amount) * 100;
                
                return {
                    ...budget.toObject(),
                    currentSpent,
                    percentage: Math.min(percentage, 100),
                    remaining: Math.max(budget.amount - currentSpent, 0)
                };
            })
        );
        
        res.json(budgetsWithSpending);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =============================
   GET BUDGET BY ID
============================= */
exports.getBudgetById = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const budget = await Budget.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate('category', 'name color icon');

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Calculate current spending for this budget
        const currentSpent = await calculateBudgetSpending(budget);
        const percentage = (currentSpent / budget.amount) * 100;

        res.json({
            ...budget.toObject(),
            currentSpent,
            percentage: Math.min(percentage, 100),
            remaining: Math.max(budget.amount - currentSpent, 0)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =============================
   ADD NEW BUDGET
============================= */
exports.addBudget = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, amount, period, category, startDate, endDate, notifications, alertThreshold } = req.body;

        // Validation
        if (!name || !amount || !category || !startDate || !endDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be positive' });
        }

        // Check if category exists and belongs to user
        const categoryExists = await ExpenseCategory.findOne({
            _id: category,
            user: req.user._id
        });

        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        // Check for overlapping budgets for same category
        const existingBudget = await Budget.findOne({
            user: req.user._id,
            category: category,
            isActive: true,
            $or: [
                { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
            ]
        });

        if (existingBudget) {
            return res.status(400).json({ 
                message: 'Budget already exists for this category in the selected time period' 
            });
        }

        const budget = new Budget({
            user: req.user._id,
            name,
            amount,
            period,
            category,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            notifications: notifications !== undefined ? notifications : true,
            alertThreshold: alertThreshold || 80
        });

        await budget.save();
        await budget.populate('category', 'name color icon');

        res.status(201).json({
            message: 'Budget created successfully',
            budget
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =============================
   UPDATE BUDGET
============================= */
exports.editBudget = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, amount, period, category, startDate, endDate, notifications, alertThreshold, isActive } = req.body;

        const updateObj = {};
        if (name) updateObj.name = name;
        if (amount) updateObj.amount = amount;
        if (period) updateObj.period = period;
        if (category) updateObj.category = category;
        if (startDate) updateObj.startDate = new Date(startDate);
        if (endDate) updateObj.endDate = new Date(endDate);
        if (notifications !== undefined) updateObj.notifications = notifications;
        if (alertThreshold) updateObj.alertThreshold = alertThreshold;
        if (isActive !== undefined) updateObj.isActive = isActive;

        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            updateObj,
            { new: true }
        ).populate('category', 'name color icon');

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.json({
            message: 'Budget updated successfully',
            budget
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =============================
   DELETE BUDGET
============================= */
exports.deleteBudget = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Also delete related alerts
        await BudgetAlert.deleteMany({ budget: req.params.id });

        res.json({ message: 'Budget deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =============================
   GET BUDGET STATS
============================= */
exports.getBudgetStats = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = new mongoose.Types.ObjectId(req.user._id);

        // Get all active budgets with spending data
        const budgets = await Budget.find({ 
            user: req.user._id, 
            isActive: true 
        }).populate('category', 'name color icon');

        const budgetStats = await Promise.all(
            budgets.map(async (budget) => {
                const currentSpent = await calculateBudgetSpending(budget);
                const percentage = (currentSpent / budget.amount) * 100;
                const remaining = Math.max(budget.amount - currentSpent, 0);
                
                let status = 'on_track';
                if (percentage >= 100) {
                    status = 'exceeded';
                } else if (percentage >= budget.alertThreshold) {
                    status = 'almost_exceeded';
                }

                return {
                    ...budget.toObject(),
                    currentSpent,
                    percentage: Math.min(percentage, 100),
                    remaining,
                    status
                };
            })
        );

        // Overall stats
        const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
        const totalSpent = budgetStats.reduce((sum, stat) => sum + stat.currentSpent, 0);
        const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

        res.json({
            budgetStats,
            overallStats: {
                totalBudget,
                totalSpent,
                totalRemaining: Math.max(totalBudget - totalSpent, 0),
                overallPercentage: Math.min(overallPercentage, 100),
                activeBudgets: budgets.length,
                exceededBudgets: budgetStats.filter(stat => stat.status === 'exceeded').length
            }
        });
    } catch (err) {
        console.error('Error getting budget stats:', err);
        res.status(500).json({ error: err.message });
    }
};

/* =============================
   CHECK BUDGET ALERTS
============================= */
exports.checkBudgetAlerts = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const budgets = await Budget.find({ 
            user: req.user._id, 
            isActive: true,
            notifications: true
        }).populate('category', 'name color icon');

        const newAlerts = [];

        for (const budget of budgets) {
            const currentSpent = await calculateBudgetSpending(budget);
            const percentage = (currentSpent / budget.amount) * 100;

            // Check if we need to create alerts
            if (percentage >= 100) {
                // Budget exceeded
                const existingAlert = await BudgetAlert.findOne({
                    budget: budget._id,
                    type: 'budget_exceeded',
                    isRead: false
                });

                if (!existingAlert) {
                    const alert = new BudgetAlert({
                        user: req.user._id,
                        budget: budget._id,
                        type: 'budget_exceeded',
                        message: `Budget "${budget.name}" has been exceeded! Spent ${currentSpent} out of ${budget.amount}`,
                        currentSpent,
                        budgetAmount: budget.amount,
                        percentage
                    });
                    await alert.save();
                    newAlerts.push(alert);
                }
            } else if (percentage >= budget.alertThreshold) {
                // Budget almost exceeded
                const existingAlert = await BudgetAlert.findOne({
                    budget: budget._id,
                    type: 'budget_almost_exceeded',
                    isRead: false
                });

                if (!existingAlert) {
                    const alert = new BudgetAlert({
                        user: req.user._id,
                        budget: budget._id,
                        type: 'budget_almost_exceeded',
                        message: `Budget "${budget.name}" is ${percentage.toFixed(1)}% used (${currentSpent}/${budget.amount})`,
                        currentSpent,
                        budgetAmount: budget.amount,
                        percentage
                    });
                    await alert.save();
                    newAlerts.push(alert);
                }
            }
        }

        res.json({
            message: 'Budget alerts checked',
            newAlerts: newAlerts.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =============================
   GET USER ALERTS
============================= */
exports.getUserAlerts = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const alerts = await BudgetAlert.find({ user: req.user._id })
            .populate('budget')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =============================
   MARK ALERT AS READ
============================= */
exports.markAlertAsRead = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const alert = await BudgetAlert.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.json({ message: 'Alert marked as read', alert });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* =============================
   HELPER: Calculate Budget Spending
============================= */
async function calculateBudgetSpending(budget) {
    const expenses = await Expense.find({
        user: budget.user,
        category: budget.category,
        date: {
            $gte: new Date(budget.startDate),
            $lte: new Date(budget.endDate)
        }
    });

    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}