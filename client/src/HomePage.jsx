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
        <h2>🔧 Tech Stack Overview</h2>
        <p>This platform is built with a powerful full-stack architecture designed for performance and scalability.</p>

        <div className="tech-stack-grid">
          <div className="tech-column">
            <h3>🖥 Frontend</h3>
            <ul>
              <li><strong>React.js</strong> - Component-based UI library</li>
              <li><strong>Vite</strong> - Lightning-fast frontend tooling</li>
              <li><strong>React Router</strong> - Routing system for navigation</li>
              <li><strong>Tailwind CSS</strong> - Utility-first styling framework</li>
              <li><strong>DaisyUI</strong> - Pre-styled Tailwind components</li>
              <li><strong>Chart.js</strong> & <strong>react-chartjs-2</strong> - Interactive data visualizations</li>
            </ul>
          </div>

          <div className="tech-column">
            <h3>🗄 Backend</h3>
            <ul>
              <li><strong>Node.js</strong> - JavaScript runtime environment</li>
              <li><strong>Express.js</strong> - Fast and minimalist web framework</li>
              <li><strong>CORS</strong> & <strong>Body-Parser</strong> - Middleware for APIs</li>
              <li><strong>Mongoose</strong> - ODM for MongoDB</li>
            </ul>
          </div>

          <div className="tech-column">
            <h3>💾 Database</h3>
            <ul>
              <li><strong>MongoDB</strong> - NoSQL database</li>
            </ul>
          </div>

          <div className="tech-column">
            <h3>⚙️ Tooling</h3>
            <ul>
              <li><strong>ESLint</strong> - Code quality & linting</li>
              <li><strong>Vite Dev Server</strong> - Hot Module Replacement</li>
              <li><strong>NPM Scripts</strong> - Build & deployment automation</li>
            </ul>
          </div>
        </div>
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
