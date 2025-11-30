const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getSavingGoals,
  addSavingGoal,
  deleteSavingGoal,
  updateSavingGoal,
  updateSavedAmount
} = require("../controllers/savingsGoalList");

// Protect all routes
router.get("/", passport.authenticate("jwt", { session: false }), getSavingGoals);
router.post("/", passport.authenticate("jwt", { session: false }), addSavingGoal);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteSavingGoal);
router.put("/:id", passport.authenticate("jwt", { session: false }), updateSavingGoal);
router.put('/:id/save', passport.authenticate('jwt', { session: false }), updateSavedAmount);

module.exports = router;
