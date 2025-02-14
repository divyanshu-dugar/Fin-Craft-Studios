const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const PORT = 8080;

// Middle wares
app.use(cors(
    {
        origin: ['http://localhost:5173']
    }
))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const expenseSchema = new mongoose.Schema({
    date: {type: Date},
    category: {type: String},
    amount: {type: Number},
    note: {type: String}
})

const Expense = mongoose.model("Expense", expenseSchema);

app.get("/expense-list", (req, res) => {
    let expenseList = Expense.find({});

    expenseList
    .then((expenseList) => {
        res.json(expenseList);
    })
    .catch((err) => res.json(err));
})

app.post("/add-expense", (req, res) => {
    let { date, category, amount, note } = req.body;

    let expense = new Expense({ date, category, amount, note });
    expense.save()
        .then(() => {
            console.log("Expense Created");
            res.status(201).json({ message: "Expense Created Successfully" });
        })
        .catch((err) => {
            console.log("Error creating expense", err);
            res.status(500).json({ error: "Failed to create expense" });
        });
});

mongoose.connect("mongodb+srv://divyanshudugar0508:sAF1pzNtLnwSJ0vL@web-development.1nggs.mongodb.net/user-data?retryWrites=true&w=majority&appName=web-development", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error: ", err));  

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app; // vercel