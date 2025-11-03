const SavingsGoalList = require("../models/SavingsGoalList");

// Get all savings goals
const getSavingGoals = async (req, res) => {
  try {
    const savingsGoalList = await SavingsGoalList.find({});
    res.json(savingsGoalList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new savings goal
const addSavingGoal = async (req, res) => {
  try {
    const { name, amount, deadline, priority, description } = req.body;

    if (!name || !amount || !deadline || !priority) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    const newGoal = new SavingsGoalList({
      name,
      amount,
      deadline,
      priority,
      description
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional: Delete a savings goal
const deleteSavingGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const deletedGoal = await SavingsGoalList.findByIdAndDelete(goalId);

    if (!deletedGoal) {
      return res.status(404).json({ error: "Savings goal not found" });
    }

    res.json({ message: "Goal deleted successfully", deletedGoal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional: Update a savings goal
const updateSavingGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const updates = req.body;

    const updatedGoal = await SavingsGoalList.findByIdAndUpdate(goalId, updates, {
      new: true,
    });

    if (!updatedGoal) {
      return res.status(404).json({ error: "Savings goal not found" });
    }

    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSavingGoals,
  addSavingGoal,
  deleteSavingGoal,
  updateSavingGoal,
};
