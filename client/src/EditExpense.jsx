import axios from "axios";
import {useState, useEffect} from "react"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function EditExpense(){
    let { id } = useParams();
    const navigate = useNavigate();

    let [expense, setExpense] = useState({_id: "", date: "", category: "", amount: 0, note: "" });

    useEffect(() => {
        axios.get(`http://localhost:8080/edit-expense/${id}`)
        .then(response => {
            setExpense((expense) => {
                return {...expense, _id: response.data._id, date: response.data.date, category: response.data.category, amount: response.data.amount, note: response.data.note
            }});
        })
        .catch((err) => console.log(err));
    },[id])

    function handleChange(event){
        setExpense((prevExpense) =>  ({...prevExpense, [event.target.name]: event.target.value})
    )}

    function handleFormSubmit(event){
        event.preventDefault();

        axios.patch("http://localhost:8080/edit-expense", expense)
        .then(() => navigate('/expense-list'))
        .catch((error) => console.log(error));
    }

    return(
        <div>
            <h1>Edit Expense</h1>
            <form onSubmit={handleFormSubmit}>
                <input type="text" name="category" value={expense.category} onChange={handleChange}/>
                <input type="number" name="amount" value={expense.amount} onChange={handleChange}/>
                <input type="text" name="note" value={expense.note} onChange={handleChange}/>
                <input type="date" name="date" value={expense.date.substring(0,10)} onChange={handleChange}/>
                <button>Make Changes</button>
            </form>
        </div>
    )
}