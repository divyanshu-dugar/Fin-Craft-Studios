const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getSavingGoals,
  addSavingGoal,
  deleteSavingGoal,
  updateSavingGoal,
} = require("../controllers/savingsGoalList");

// Protect all routes
router.get("/", passport.authenticate("jwt", { session: false }), getSavingGoals);
router.post("/", passport.authenticate("jwt", { session: false }), addSavingGoal);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteSavingGoal);
router.put("/:id", passport.authenticate("jwt", { session: false }), updateSavingGoal);

module.exports = router;
