import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Navbar"
import Expense from "./Expense"
import ExpenseList from "./ExpenseList"
import EditExpense from './EditExpense';

function App() {

  return (
    <>
      <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<ExpenseList/>}/>
          <Route path="/add-expense" element={<Expense />} />
          <Route path="/expense-list" element={<ExpenseList/>} />
          <Route path="/edit-expense/:id" element={<EditExpense/>} />
          {/* 404 Page */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
