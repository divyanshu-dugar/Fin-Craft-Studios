import { useEffect, useState } from "react"
import axios from "axios";

export default function SavingsGoalList(){
    let [savingsGoalList, setSavingsGoalList] = useState([{}]);

    useEffect(() => {
        axios.get("/saving-goals")
        .then(response => setSavingsGoalList(response.data))
        .catch(err => console.log(err));
    },[])

    return(
        <>
            <h1>Savings Goal List</h1>
            {/* {savingsGoalList.map((goal) => {
            <div>
                <h3>Goal: {goal.name}</h3>
                <p>Amount: {goal.amount}</p>
                <p>Deadline: 2023-02-15</p>
                <p>Priority Level</p>
                <p>Category</p>
            </div>
            })} */}
        </>
    )
}