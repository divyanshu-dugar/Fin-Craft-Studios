import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Navbar"
import Expense from "./Expense"
import ExpenseList from "./ExpenseList"

function App() {

  return (
    <>
      <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<ExpenseList/>}/>
          <Route path="/expense" element={<Expense />} />
          <Route path="/expense-list" element={<ExpenseList/>} />
          {/* 404 Page */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
