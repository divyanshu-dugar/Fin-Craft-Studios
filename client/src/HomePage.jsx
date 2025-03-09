import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="px-6 py-12 max-w-7xl mx-auto text-white font-ubuntu">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-yellow-400">Welcome to Fin-Craft Studios</h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Your one-stop platform for managing your finances with ease and efficiency — Track incomes, plan expenses, set savings goals, calculate taxes, and more!
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/income-list" className="bg-yellow-400 text-black px-6 py-3 rounded-2xl shadow hover:bg-yellow-500 transition">Start Ledgerify</Link>
          <Link to="/savings-goal-list" className="bg-gray-800 text-white px-6 py-3 rounded-2xl shadow hover:bg-gray-700 transition">Explore Savify</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-2 text-yellow-300">Ledgerify</h3>
          <p>Keep track of your income and expenses effortlessly. Monitor your cash flow and take better control of your finances.</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-2 text-yellow-300">Savify</h3>
          <p>Set and achieve your savings goals. Whether you're saving for a vacation or emergency fund, we've got you covered.</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-2 text-yellow-300">Other Tools</h3>
          <p>From Tax Calculators to Currency Converters, boost your financial literacy and simplify money management.</p>
        </div>
      </section>

      {/* Developer Section */}
      <section className="bg-gray-950 p-10 rounded-2xl shadow-xl mb-20">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">For Developers</h2>
        <p className="text-gray-300 mb-4">This project is built using modern web technologies like <span className="text-yellow-300">React</span>, <span className="text-yellow-300">Tailwind CSS</span>, and <span className="text-yellow-300">React Router</span>. It's completely open-source and we welcome contributions from developers around the world.</p>
        <p className="text-gray-300">Feel free to explore the codebase, suggest improvements, or fork the repository to build your own version!</p>
      </section>

      {/* GitHub Section */}
      <section className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-2">View Our Code on GitHub</h2>
        <p className="text-gray-300 mb-4">Access the full source code, track updates, and contribute to the project.</p>
        <a
          href="https://github.com/divyanshu-dugar/Fin-Craft-Studios"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded-2xl hover:bg-yellow-500 transition"
        >
          📂 View Repository
        </a>
      </section>
    </div>
  );
}
