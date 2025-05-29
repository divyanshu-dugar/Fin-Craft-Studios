import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function IncomeList() {
  const navigate = useNavigate();

  let [incomeList, setIncomeList] = useState([]);
  let [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("https://ledgerify-server.vercel.app/income")
      .then((response) => setIncomeList(response.data))
      .catch((error) => console.log(error));

    axios
      .get("https://ledgerify-server.vercel.app/income-categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.log(error));
  }, []);

  function handleDelete(id) {
    axios
      .delete(`https://ledgerify-server.vercel.app/income/${id}`)
      .then(() =>
        setIncomeList((prevList) =>
          prevList.filter((income) => income._id != id)
        )
      )
      .catch((err) => console.log(err));
  }

  const groupedIncome = incomeList.reduce((acc, ele) => {
    let date = new Date(ele.date);
    let monthYear = `${date.toLocaleString("deafult", {
      month: "long",
    })} ${date.getFullYear()}`;

    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(ele);

    return acc;
  }, {});

  const sortedMonths = Object.keys(groupedIncome).sort((a, b) => {
    let [monthA, yearA] = a.split(" ");
    let [monthB, yearB] = b.split(" ");

    return (
      new Date(`${monthB} 1, ${yearB}`) - new Date(`${monthA} 1, ${yearA}`)
    );
  });

  return (
    <>
      <h1>Income List</h1>
      {sortedMonths.map((month) => (
        <div key={month}>
          <h2>{month}</h2>
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
              {groupedIncome[month].map((ele) => (
                <tr key={ele._id}>
                  <td>{new Date(ele.date).toLocaleDateString()}</td>
                  <td>
                    {categories.find((cat) => cat._id === ele.category)?.name ||
                      "Unknown"}
                  </td>
                  <td>{ele.amount}</td>
                  <td>{ele.note}</td>
                  <td>
                    <button onClick={() => navigate(`/edit-income/${ele._id}`)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(ele._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <button onClick={() => navigate("/add-income")}>Add Income</button>
    </>
  );
}
