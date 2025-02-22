import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link className="navbar-logo" to="/">💸 Ledgerify</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/income-list">Income Tracker</Link>
          <ul>
            <li><Link to="/add-income">Add Income</Link></li>
            <li><Link to="/add-income-category">Add Category</Link></li>
          </ul>
        </li>
        <li>
          <Link to="/expense-list">Expense Tracker</Link>
          <ul>
            <li><Link to="/add-expense">Add Expense</Link></li>
            <li><Link to="/add-category">Add Category</Link></li>
          </ul>
        </li>
        <li>
          <Link to="/savings-goal-list">Savings Goal Tracker</Link>
          <ul>
            <li><Link to="/add-savings-goal">Add Savings Goal</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
