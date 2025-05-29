import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../main.css";

function SavingsGoal() {
  const navigate = useNavigate();
  const [savingsGoal, setSavingsGoal] = useState({
    name: "",
    amount: "",
    deadline: "",
    priority: "",
    description: "", 
  });

  const handleChange = (event) => {
    setSavingsGoal({
      ...savingsGoal,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:8080/saving-goals", savingsGoal);
      navigate("/savings-goal-list");
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  return (
    <>
      <h2>Add Your Savings Goal</h2>
      <div>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="name"
            value={savingsGoal.name}
            onChange={handleChange}
            placeholder="Goal Name (e.g. New Phone)"
            required
          />

          <input
            type="number"
            name="amount"
            value={savingsGoal.amount}
            onChange={handleChange}
            placeholder="Amount (e.g. 500)"
            required
          />

          <input
            type="date"
            name="deadline"
            value={savingsGoal.deadline}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            value={savingsGoal.description}
            onChange={handleChange}
            placeholder="Description (Optional)"
            rows={4}
          />

    <br />

          <select
            name="priority"
            value={savingsGoal.priority}
            onChange={handleChange}
            required
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

                <br /><br />
          <button type="submit">Add Savings Goal</button>
        </form>
      </div>
    </>
  );
}

export default SavingsGoal;
