import { useState, useEffect } from "react";
import axios from "axios";
import "./expense.css";

function ExpenseList(){
    let [expenseList, setExpenseList] = useState([]);

    useEffect(()=>{
        axios.get("http://localhost:8080/expense-list")
        .then(response => {
            console.log(response.data);
            setExpenseList(response.data)
    })
        .catch(error => console.log(error))
    },[]);

    return(
        <>
            <h1>Expense List</h1>
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        expenseList.map((ele, index) => (
                            <tr key={index}>
                                <td>{new Date(ele.date).toLocaleDateString()}</td>
                                <td>{ele.category}</td>
                                <td>{ele.amount}</td>
                                <td>{ele.note}</td>
                            </tr>
                        ))
                    }
                    
                    </tbody>
                </table>
        </>
    )
}

export default ExpenseList;