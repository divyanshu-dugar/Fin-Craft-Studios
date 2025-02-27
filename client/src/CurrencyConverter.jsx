import { useState, useEffect } from "react";
import axios from "axios";
import "./currencyconverter.css";

function CurrencyConverter() {
    const [currencies, setCurrencies] = useState([]);
    const [amount, setAmount] = useState("");
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("CAD");
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get("https://api.exchangerate-api.com/v4/latest/USD")
            .then(response => setCurrencies(Object.keys(response.data.rates)))
            .catch(error => console.error("Error fetching currency data:", error));
    }, []);

    const convertCurrency = () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);
        axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
            .then(response => {
                const rate = response.data.rates[toCurrency];
                setConvertedAmount((amount * rate).toFixed(2));
            })
            .catch(error => console.error("Error converting currency:", error))
            .finally(() => setLoading(false));
    };

    return (
        <div className="currency-container">
            <h2>Currency Converter</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
            />
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {currencies.map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                ))}
            </select>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {currencies.map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                ))}
            </select>
            <button onClick={convertCurrency}>Convert</button>

            {loading && <p>Loading exchange rate...</p>}
            {convertedAmount !== null && !loading && (
                <h3>Converted Amount: {convertedAmount} {toCurrency}</h3>
            )}
        </div>
    );
}

export default CurrencyConverter;
