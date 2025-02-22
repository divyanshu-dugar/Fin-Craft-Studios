import { useNavigate } from "react-router-dom"
import { useState } from "react";

export default function IncomeList(){
    const navigate = useNavigate();

    let [incomeList, setIncomeList] = useState([{}]);
    let [categories, setCategories] = useState([{}]);

    function handleDelete(){

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
                    <button onClick={() => navigate(`/edit-expense/${ele._id}`)}>Edit</button>
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