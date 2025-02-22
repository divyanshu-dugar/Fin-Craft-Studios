import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import "./expense.css"

function Expense() {
    let navigate = useNavigate();
    let [expense, setExpense] = useState({ date: "", category: "", amount: "", note: "" });
    let [category, setCategory] = useState([{_id: "", category: ""}])

    useEffect(() => {
        axios.get("http://localhost:8080/categories")
        .then(response => {
            setCategory(response.data)
        })
        .catch((err) => console.log(err))
    }, [])

    async function handleFormSubmit(event){
        event.preventDefault();

        axios.post("http://localhost:8080/expenses", expense)
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
                    <label htmlFor="category">Choose a Category: </label>
                    <select id="category" value={expense.category} onChange={handleChange} name="category">
                        <option value="">Select Category</option>
                        {category.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                    <input type="number" name="amount" id="amount" value={expense.amount} onChange={handleChange} placeholder="Add Amount"/>
                    <input type="text" name="note" id="note" value={expense.note} onChange={handleChange} placeholder="Add Note" />
                    <button>Add Expense</button>
                </form>
            </div>
        </>
    );
}

export default Expense;
