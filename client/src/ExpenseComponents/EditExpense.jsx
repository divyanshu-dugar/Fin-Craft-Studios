import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditExpense() {
  let { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState({
    _id: "",
    date: "",
    category: "",
    amount: 0,
    note: "",
  });

  const [categories, setCategories] = useState([]);

  // Fetch expense and categories
  useEffect(() => {
    axios
      .get(`http://localhost:8080/expenses/${id}`)
      .then((response) => {
        setExpense({
          _id: response.data._id,
          date: response.data.date,
          category: response.data.category,
          amount: response.data.amount,
          note: response.data.note,
        });
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8080/categories")
      .then((response) => setCategories(response.data))
      .catch((err) => console.log(err));
  }, [id]);

  // Handle form input change
  function handleChange(event) {
    setExpense((prevExpense) => ({
      ...prevExpense,
      [event.target.name]: event.target.value,
    }));
  }

  // Submit the updated expense
  function handleFormSubmit(event) {
    event.preventDefault();

    axios
      .patch("http://localhost:8080/expenses", expense)
      .then(() => navigate("/expense-list"))
      .catch((error) => console.log(error));
  }

  return (
    <div>
      <h1>Edit Expense</h1>
      <form onSubmit={handleFormSubmit}>
        <label>Category: </label>
        <select
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <br /> <br />
        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />

        <label>Note:</label>
        <input
          type="text"
          name="note"
          value={expense.note}
          onChange={handleChange}
        />

        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={expense.date.substring(0, 10)}
          onChange={handleChange}
        />

        <button>Make Changes</button>
      </form>
    </div>
  );
}
