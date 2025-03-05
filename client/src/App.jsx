import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Navbar"
import AddExpense from "./AddExpense"
import ExpenseList from "./ExpenseList"
import EditExpense from './EditExpense';
import AddCategory from './AddCategory';
import IncomeList from './IncomeList';
import AddIncome from './AddIncome';
import AddIncomeCategory from './AddIncomeCategory'
import SavingsGoalList from './SavingsGoalList'
import TaxCalculator from './TaxCalculator';
import CurrencyConverter from "./CurrencyConverter";

function App() {

  return (
    <>
      <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<ExpenseList/>}/>
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/add-category" element={<AddCategory/>} />
          <Route path="/expense-list" element={<ExpenseList/>} />
          <Route path="/edit-expense/:id" element={<EditExpense/>} />
          <Route path="/income-list" element={<IncomeList/>} />
          <Route path="/add-income" element={<AddIncome />} />
          <Route path="/add-income-category" element={<AddIncomeCategory />} />
          <Route path="/savings-goal-list" element={<SavingsGoalList />}/>
          <Route path="/tax-calculator" element={<TaxCalculator />} />
          <Route path="/currency-converter" element={<CurrencyConverter />} />
          {/* 404 Page */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
