import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function EditIncome(){
    let {id} = useParams();
    const navigate = useNavigate();

    let [income, setIncome] = useState({
        _id: "",
        date: "",
        category: "",
        amount: 0,
        note: "",
    });

    let[categories, setCategories] = useState([{
        _id: "",
        name: ""
    }])

    useEffect(() => {
        axios.get(`http://localhost:8080/income/${id}`)
        .then(response => setIncome(response.data))
        .then(
            axios.get("http://localhost:8080/income-categories")
            .then(response => setCategories(response.data))
        )
        .catch(error => console.error(error));
    }, [id])

    function handleFormSubmit(event){
        event.preventDefault();

        axios.patch(`http://localhost:8080/income`, income)
        .then(() => {
            console.log("Income Updated!")
            navigate('/income-list')
    })
        .catch(error => console.error(error));
    }

    function handleInputChange(e){
        setIncome((prevValue) => ({...prevValue, [e.target.name] : e.target.value}));
    }

    return (<>
        <form onSubmit={handleFormSubmit}>
        <label htmlFor="category">Category: </label>
        <select name="category" value={income.category}     id="category" onChange={handleInputChange}>
            {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}

        </select>
        <br /><br />

            <label htmlFor="amount">Amount</label>
            <input type="number" name="amount" id="amount" value={income.amount} onChange={handleInputChange}/>

            <label htmlFor="note">Note</label>
            <input type="text" name="note" id="note" value={income.note} onChange={handleInputChange}/>
            
            <label htmlFor="date">Date</label>
            <input type="date" name="date" id="date" value={income.date.substring(0, 10)} onChange={handleInputChange}/>
            <button>Submit</button>
        </form>
    </>)
}