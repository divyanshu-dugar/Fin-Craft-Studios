import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import "./expense.css"

function Expense() {
    let navigate = useNavigate();
    let [expense, setExpense] = useState({ date: "", category: "", amount: 0, note: "" });

    async function handleFormSubmit(event){
        event.preventDefault();

        axios.post("http://localhost:8080/add-expense", expense)
        .then(() => {
            navigate('/expense-list');
        })
        .catch((error) => console.log(error))
    }

    function handleChange(event) {
        setExpense({...expense, [event.target.name]: event.target.value});
    }

    return (
        <>
            <h2>Add your expense</h2>
            <div>
                <form onSubmit={handleFormSubmit}>
                    <input type="date" name="date" id="date" value={expense.date} onChange={handleChange} />
                    <input type="text" name="category" id="category" value={expense.category} onChange={handleChange} />
                    <input type="number" name="amount" id="amount" value={expense.amount} onChange={handleChange} />
                    <input type="text" name="note" id="note" value={expense.note} onChange={handleChange} />
                    <button>Add Expense</button>
                </form>
            </div>
        </>
    );
}

export default Expense;
