import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link className="navbar-logo" to="/">💸 Fin-Craft Studios</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>

        <li>
          <span>Ledgerify</span>
          <ul className="dropdown">
            <li>
              <span>Income Tracker</span>
              <ul className="submenu">
                <li><Link to="/income-list">Income List</Link></li>
                <li><Link to="/add-income">Add Income</Link></li>
                <li><Link to="/add-income-category">Add Category</Link></li>
              </ul>
            </li>
            <li>
              <span>Expenses Tracker</span>
              <ul className="submenu">
                <li><Link to="/expense-list">Expense List</Link></li>
                <li><Link to="/add-expense">Add Expense</Link></li>
                <li><Link to="/add-category">Add Category</Link></li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <span>Budgetify</span>
          <ul className="dropdown">
            <li><Link to="/">Coming Soon!🔒</Link></li>
            <li><Link to="/">Coming Soon!🔒</Link></li>
          </ul>
        </li>

        <li>
          <span>Investify</span>
          <ul className="dropdown">
            <li><Link to="/">Coming Soon!🔒</Link></li>
            <li><Link to="/">Coming Soon!🔒</Link></li>
          </ul>
        </li>

        <li>
          <span>Savify</span>
          <ul className="dropdown">
            <li><Link to="/savings-goal-list">Savings Goal List</Link></li>
            <li><Link to="/add-savings-goal">Add Savings Goal</Link></li>
          </ul>
        </li>

        <li>
          <span>Other Tools</span>
          <ul className="dropdown">
            <li><Link to="/tax-calculator">Tax Calculator</Link></li>
            <li><Link to="/currency-converter">Currency Converter</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
