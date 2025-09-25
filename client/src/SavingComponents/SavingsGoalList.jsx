import { useEffect, useState } from "react";
import axios from "axios";
import "../SavingsGoalList.css"; 

export default function SavingsGoalList() {
  const [savingsGoalList, setSavingsGoalList] = useState([{}]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/saving-goals")
      .then((response) => {
        setSavingsGoalList(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const getPriorityColor = (priority) => {
    const colors = {
      high: "#ff4757",
      medium: "#ffa502",
      low: "#2ed573"
    };
    return colors[priority?.toLowerCase()] || "#a4b0be";
  };

  const getProgressPercentage = (goal) => {
    // Assuming you might add currentAmount later
    const current = goal.currentAmount || 0;
    return Math.min(Math.round((current / goal.amount) * 100), 100);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your savings goals...</p>
      </div>
    );
  }

  return (
    <div className="savings-goals-page">
      <header className="page-header">
        <h1 className="page-title">💰 Savings Goals</h1>
        <p className="page-subtitle">Track and manage your financial aspirations</p>
      </header>

      <div className="goals-container">
        {savingsGoalList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No savings goals yet</h3>
            <p>Start by creating your first savings goal</p>
          </div>
        ) : (
          savingsGoalList.map((goal) => {
            const progress = getProgressPercentage(goal);
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <div className="goal-card" key={goal._id}>
                <div className="card-header">
                  <h3 className="goal-title">{goal.name}</h3>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(goal.priority) }}
                  >
                    {goal.priority}
                  </span>
                </div>
                
                <div className="progress-section">
                  <div className="progress-info">
                    <span className="amount">${goal.amount.toLocaleString()}</span>
                    <span className="progress-text">{progress}% achieved</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="goal-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <div className="detail-content">
                      <span className="detail-label">Deadline</span>
                      <span className="detail-value">{new Date(goal.deadline).toLocaleDateString()}</span>
                      <span className="days-left">{daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</span>
                    </div>
                  </div>
                  
                  {goal.description && (
                    <div className="detail-item">
                      <span className="detail-icon">📝</span>
                      <div className="detail-content">
                        <span className="detail-label">Description</span>
                        <span className="detail-value">{goal.description}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button className="action-btn edit-btn">Edit</button>
                  <button className="action-btn delete-btn">Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="floating-action-container">
        <a href="/add-savings-goal" className="floating-add-btn">
          <span className="btn-icon">+</span>
          <span className="btn-text">Add Goal</span>
        </a>
      </div>
    </div>
  );
}