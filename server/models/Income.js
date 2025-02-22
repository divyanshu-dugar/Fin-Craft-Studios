const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    category: {type: String, required: true},
    amount: {type: Number, required: true},
    note: {type: String}
})

module.exports = mongoose.model("Income", incomeSchema);