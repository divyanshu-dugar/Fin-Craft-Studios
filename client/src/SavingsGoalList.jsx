import { useEffect, useState } from "react";
import axios from "axios";
import "./SavingsGoalList.css"; 

export default function SavingsGoalList() {
  const [savingsGoalList, setSavingsGoalList] = useState([{}]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/saving-goals")
      .then((response) => setSavingsGoalList(response.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h1 className="page-title">💰 Savings Goal List</h1>

      <div className="goals-container">
        {savingsGoalList.length === 0 ? (
          <p>No savings goals found. Add one!</p>
        ) : (
          savingsGoalList.map((goal) => (
            <div className="goal-card" key={goal._id}>
              <h3 className="goal-title">{goal.name}</h3>
              <p><strong>💲 Amount:</strong> ${goal.amount}</p>
              <p><strong>📅 Deadline:</strong> {new Date(goal.deadline).toLocaleDateString()}</p>
              <p><strong>📌 Priority:</strong> {goal.priority}</p>
              {goal.description && (
                <p><strong>📝 Description:</strong> {goal.description}</p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="add-button-container">
        <a href="/add-savings-goal" className="add-btn">➕ Add Savings Goal</a>
      </div>
    </>
  );
}
