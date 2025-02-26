import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import "./expense.css";
import {sortData} from './Utils/helper';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function ExpenseList() {
  let navigate = useNavigate();
  let [expenseList, setExpenseList] = useState([]);
  let [categories, setCategories] = useState([]);
  let [chartData, setChartData] = useState(null);
  let [barData, setBarData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/expenses")
      .then(response => setExpenseList(sortData(response.data)))
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

      const categoryFrequency = expenseList.reduce((freq, {category}) => {
        freq[category] = (freq[category] ?? 0) + 1;
        return freq;
      }, {});
  
      const labels = Object.keys(categoryTotals).map(
        (categoryId) => categories.find((cat) => cat._id === categoryId)?.name || "Unknown"
      );

      const barLabels = Object.keys(categoryFrequency).map((cat_id) => (
        categories.find((c) => cat_id === c._id)?.name || "Unknown"
      ))
  
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

      setBarData({
        labels: barLabels,
        datasets: [
          {
            label: "Expense by Frequency",
            data: Object.values(categoryFrequency),
            backgroundColor: ["#d4af37", "#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#ab47bc"],
            hoverOffset: 8,
          }
        ]
      })
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

      {chartData && barData && (
        <div style={{ display: "flex", justifyContent: "space-evenly", gap: "20px", width: "100%", maxWidth: "600px", margin: "0 auto 20px auto" }}>
          <div style={{ flex: 1 }}>
            <Pie data={chartData} />
          </div>
          <div style={{ flex: 1 }}>
            <Bar data={barData} />
          </div>
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

      <button onClick={() => navigate("/add-expense")}>Add Expense</button>
    </>
  );
}

export default ExpenseList;
