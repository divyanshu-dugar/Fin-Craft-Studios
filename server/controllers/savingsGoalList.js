const SavingsGoalList = require("../models/SavingsGoalList");

// ✅ Get all savings goals for logged-in user
const getSavingGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    const savingsGoalList = await SavingsGoalList.find({ user: userId }).sort({ createdAt: -1 });
    res.json(savingsGoalList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add a new savings goal for logged-in user
const addSavingGoal = async (req, res) => {
  try {
    const { name, amount, deadline, priority, description } = req.body;

    if (!name || !amount || !deadline || !priority) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    const newGoal = new SavingsGoalList({
      user: req.user._id,
      name,
      amount,
      deadline,
      priority,
      description,
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a savings goal (only if owned by user)
const deleteSavingGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const goalId = req.params.id;

    const deletedGoal = await SavingsGoalList.findOneAndDelete({
      _id: goalId,
      user: userId,
    });

    if (!deletedGoal) {
      return res.status(404).json({ error: "Savings goal not found or unauthorized" });
    }

    res.json({ message: "Goal deleted successfully", deletedGoal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a savings goal (only if owned by user)
const updateSavingGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const goalId = req.params.id;
    const updates = req.body;

    const updatedGoal = await SavingsGoalList.findOneAndUpdate(
      { _id: goalId, user: userId },
      updates,
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ error: "Savings goal not found or unauthorized" });
    }

    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /saving-goals/:id/save
exports.updateSavedAmount = async (req, res) => {
  try {
    const { savedAmount } = req.body;
    const goal = await SavingGoal.findById(req.params.id);

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    goal.savedAmount = savedAmount;
    await goal.save();

    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: "Error updating saved amount" });
  }
};

module.exports = {
  getSavingGoals,
  addSavingGoal,
  deleteSavingGoal,
  updateSavingGoal,
};
