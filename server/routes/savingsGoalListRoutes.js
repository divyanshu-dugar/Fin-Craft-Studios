const express = require("express");
const {getSavingGoals} = require("../controllers/savingsGoalListController");

const router = express.Router();

router.get("/", getSavingGoals);

module.exports = router;