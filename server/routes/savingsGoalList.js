const express = require("express");
const {
  getSavingGoals,
  addSavingGoal,
  deleteSavingGoal,
  updateSavingGoal,
} = require("../controllers/savingsGoalList");

const router = express.Router();

router.get("/", getSavingGoals);                 // GET all savings goals
router.post("/", addSavingGoal);                 // POST add a new goal
router.delete("/:id", deleteSavingGoal);         // DELETE goal by ID
router.put("/:id", updateSavingGoal);            // PUT update goal by ID

module.exports = router;
