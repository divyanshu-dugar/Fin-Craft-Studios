import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios";

export default function IncomeList(){
    const navigate = useNavigate();

    let [incomeList, setIncomeList] = useState([]);
    let [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/income")
          .then(response => setIncomeList(response.data))
          .catch(error => console.log(error));
      
        axios.get("http://localhost:8080/income-categories")
          .then(response => setCategories(response.data))
          .catch(error => console.log(error));
      }, []);

    function handleDelete(id){
        axios.delete(`http://localhost:8080/income/${id}`)
        .then(() => setIncomeList((prevList) => prevList.filter((income) => income._id != id)))
        .catch(err => console.log(err));
    }

    return (
        <>
            <h1>Income List</h1>

            <table className="table">
            <thead>
            <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {incomeList.map((ele) => (
                <tr key={ele._id}>
                <td>{new Date(ele.date).toLocaleDateString()}</td>
                <td>{categories.find((cat) => cat._id === ele.category)?.name || "Unknown"}</td>
                <td>{ele.amount}</td>
                <td>{ele.note}</td>
                <td>
                    <button onClick={() => navigate(`/edit-income/${ele._id}`)}>Edit</button>
                    <button onClick={() => handleDelete(ele._id)}>Delete</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        <button onClick={() => navigate("/add-income")}>Add Income</button>
      </>
    )
}