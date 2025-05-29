import { useState } from "react";
import "./main.css";

function TaxCalculator() {
    let [taxData, setTaxData] = useState({ income: "", taxRate: "", taxAmount: "" });

    function handleChange(event) {
        setTaxData({ ...taxData, [event.target.name]: event.target.value });
    }

    function calculateTax(event) {
        event.preventDefault();
        const income = parseFloat(taxData.income);
        const taxRate = parseFloat(taxData.taxRate);

        if (!isNaN(income) && !isNaN(taxRate)) {
            const taxAmount = (income * taxRate) / 100;
            setTaxData({ ...taxData, taxAmount: taxAmount.toFixed(2) });
        }
    }

    return (
        <>
            <h2 className="title">Tax Calculator</h2>
            <div className="tax-container">  {/* Make sure this is the only main wrapper */}
                <form onSubmit={calculateTax}>
                    <input 
                        type="number" 
                        name="income" 
                        value={taxData.income} 
                        onChange={handleChange} 
                        placeholder="Enter your income" 
                    />
                    <input 
                        type="number" 
                        name="taxRate" 
                        value={taxData.taxRate} 
                        onChange={handleChange} 
                        placeholder="Enter tax rate (%)" 
                    />
                    <div className="button-container">
                        <button type="submit">Calculate Tax</button>
                    </div>
                    {taxData.taxAmount && (
                        <h3 className="tax-result">Tax Amount: ${taxData.taxAmount}</h3>
                    )}
                </form>
            </div>
        </>
    );
}

export default TaxCalculator;
