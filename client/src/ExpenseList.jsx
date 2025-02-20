import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./expense.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseList() {
  let navigate = useNavigate();
  let [expenseList, setExpenseList] = useState([]);
  let [chartData, setChartData] = useState(null);
  let [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/expenses")
      .then(response => setExpenseList(response.data))
      .catch(error => console.log(error));
  
    axios.get("http://localhost:8080/categories")
      .then(response => setCategories(response.data))
      .catch(error => console.log(error));
  }, []);
  

  useEffect(() => {
    if (expenseList.length > 0 && categories.length > 0) {
      const categoryTotals = expenseList.reduce((totals, { category, amount }) => {
        totals[category] = (totals[category] ?? 0) + amount;
        return totals;
      }, {});
  
      const labels = Object.keys(categoryTotals).map(
        (categoryId) => categories.find((cat) => cat._id === categoryId)?.name || "Unknown"
      );
  
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Expenses by Category",
            data: Object.values(categoryTotals),
            backgroundColor: ["#d4af37", "#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#ab47bc"],
            hoverOffset: 8,
          },
        ],
      });
    }
  }, [expenseList, categories]);

  function handleDelete(id) {
    axios.delete(`http://localhost:8080/expenses/${id}`)
      .then(() => setExpenseList((prevList) => prevList.filter((item) => item._id !== id)))
      .catch(err => console.log(err));
  }

  return (
    <>
      <h1>Expense List</h1>

      {chartData && (
        <div style={{ width: "400px", margin: "0 auto", marginBottom: "20px" }}>
          <Pie data={chartData} />
        </div>
      )}

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
          {expenseList.map((ele) => (
            <tr key={ele._id}>
              <td>{new Date(ele.date).toLocaleDateString()}</td>
              <td>{categories.find((cat) => cat._id === ele.category).name}</td>
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

      <button onClick={() => navigate("/add-expense")}>Add Expense</button>
    </>
  );
}

export default ExpenseList;
