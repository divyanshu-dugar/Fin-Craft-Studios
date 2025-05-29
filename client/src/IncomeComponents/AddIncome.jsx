import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import "../main.css"

function Income() {
    let navigate = useNavigate();
    let [income, setIncome] = useState({ date: "", category: "", amount: "", note: "" });
    let [category, setCategory] = useState([{_id: "", category: ""}])

    useEffect(() => {
        axios.get("http://localhost:8080/income-categories")
        .then(response => {
            setCategory(response.data)
        })
        .catch((err) => console.log(err))
    }, [])

    async function handleFormSubmit(event){
        event.preventDefault(); 

        axios.post("http://localhost:8080/income", income)
        .then(() => {
            navigate('/income-list');
        })
        .catch((error) => console.log(error))
    }

    function handleChange(event) {
        setIncome({...income, [event.target.name]: event.target.value});
    }

    return (
        <>
            <h2>Add your income</h2>
            <div>
                <form onSubmit={handleFormSubmit}>
                    <input type="date" name="date" id="date" value={income.date} onChange={handleChange} />
                    <label htmlFor="category">Choose a Category: </label>
                    <select id="category" value={income.category} onChange={handleChange} name="category">
                        <option value="">Select Category</option>
                        {category.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                    <input type="number" name="amount" id="amount" value={income.amount} onChange={handleChange} placeholder="Add Amount"/>
                    <input type="text" name="note" id="note" value={income.note} onChange={handleChange} placeholder="Add Note" />
                    <button>Add Income</button>
                </form>
            </div>
        </>
    );
}

export default Income;
