import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <h1>Welcome to 💸 Fin-Craft Studios</h1>
        <p>Your all-in-one financial companion for smarter money decisions.</p>
        <Link className="home-cta-button" to="/expense-list">Get Started</Link>
      </section>

      {/* Tools Overview */}
      <section className="home-tools">
        <h2>Explore Our Financial Tools</h2>
        <div className="home-tools-grid">
          <div className="tool-card">
            <h3>Ledgerify</h3>
            <p>Track your income and expenses seamlessly with Income & Expense Trackers.</p>
          </div>
          <div className="tool-card">
            <h3>Savify</h3>
            <p>Set, track, and conquer your savings goals—one step at a time.</p>
          </div>
          <div className="tool-card">
            <h3>Budgetify</h3>
            <p>Manage your budget and plan better every month (Coming Soon!).</p>
          </div>
          <div className="tool-card">
            <h3>Investify</h3>
            <p>Learn to invest smartly and grow your wealth (Coming Soon!).</p>
          </div>
          <div className="tool-card">
            <h3>Other Tools</h3>
            <p>Tax Calculator, Currency Converter, ...</p>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="home-developers">
        <h2>🔧 For Developers</h2>
        <p>
          This platform is built using <strong>React.js</strong>, <strong>React Router</strong>, and styled with clean, modular CSS.
        </p>
        <p>
          Our goal is to promote open-source collaboration and empower the dev community to contribute!
        </p>
      </section>

      {/* GitHub Section */}
      <section className="home-github">
        <h2>📂 Source Code</h2>
        <p>
          Check out our project on GitHub and feel free to fork, star, or contribute.
        </p>
        <a href="https://github.com/divyanshu-dugar/Fin-Craft-Studios" target="_blank" rel="noopener noreferrer" className="github-button">
          View on GitHub
        </a>
      </section>
    </div>
  );
};

export default Home;
