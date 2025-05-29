import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Navbar"
import AddExpense from "./ExpenseComponents/AddExpense"
import ExpenseList from "./ExpenseComponents/ExpenseList"
import EditExpense from './ExpenseComponents/EditExpense';
import EditIncome from  './IncomeComponents/EditIncome';
import AddCategory from './ExpenseComponents/AddCategory';

import IncomeList from './IncomeComponents/IncomeList';
import AddIncome from './IncomeComponents/AddIncome';
import AddIncomeCategory from './IncomeComponents/AddIncomeCategory'

import AddSavingsGoal from "./SavingComponents/AddSavingsGoal";
import SavingsGoalList from './SavingComponents/SavingsGoalList'
import TaxCalculator from './TaxCalculator';
import CurrencyConverter from "./CurrencyConverter";

import HomePage from './HomePage';

function App() {

  return (
    <>
      <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/add-category" element={<AddCategory/>} />
          <Route path="/add-savings-goal" element={<AddSavingsGoal />} />
          <Route path="/expense-list" element={<ExpenseList/>} />
          <Route path="/edit-expense/:id" element={<EditExpense/>} />
          <Route path="/edit-income/:id" element={<EditIncome/>} />
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
