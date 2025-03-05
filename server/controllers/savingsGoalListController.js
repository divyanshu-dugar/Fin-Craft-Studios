import SavingsGoalList from "../models/SavingsGoalList"

const getSavingGoals = async(req, res) => {
    try{
        const savingsGoalList = await SavingsGoalList.find({});
        res.json(savingsGoalList);
    } catch(err){
        res.status(500).json({err});
    }
}

module.exports = {getSavingGoals};