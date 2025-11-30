const express = require('express');
const router = express.Router();
const {
    getBudgets,
    getBudgetById,
    addBudget,
    editBudget,
    deleteBudget,
    getBudgetStats,
    checkBudgetAlerts,
    getUserAlerts,
    markAlertAsRead
} = require('../controllers/budget');
const passport = require("passport");

// All routes are protected
router.get('/', passport.authenticate('jwt', { session: false }), getBudgets);
router.get('/stats', passport.authenticate('jwt', { session: false }), getBudgetStats);
router.get('/alerts', passport.authenticate('jwt', { session: false }), getUserAlerts);
router.get('/check-alerts', passport.authenticate('jwt', { session: false }), checkBudgetAlerts);
router.get('/:id', passport.authenticate('jwt', { session: false }), getBudgetById);
router.post('/', passport.authenticate('jwt', { session: false }), addBudget);
router.put('/:id', passport.authenticate('jwt', { session: false }), editBudget);
router.put('/alerts/:id/read', passport.authenticate('jwt', { session: false }), markAlertAsRead);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteBudget);

module.exports = router;