const mongoose = require("mongoose");

const savingsGoalList = new mongoose.Schema(
    {
        name: {type: String, required: true},
        amount: {type: Number, required: true},
        deadline: {type: Date, required: true},
        priority: {type: String, required: true},
        description: {type: String}
    }
)

module.exports = mongoose.model("SavingsGoalList", savingsGoalList);