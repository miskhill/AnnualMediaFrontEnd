import React, { useState } from "react";

const AnnualTotals = ({ arr, year, handleYearChange }) => {
  const [inputYear, setInputYear] = useState(year.toString());

  const handleInputChange = (e) => {
    setInputYear(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleYearChange(inputYear === 'All' ? 'All' : parseInt(inputYear));
  };

  const annualTotals = (arr, year) => {
    let total = 0;
    arr.forEach((item) => {
      if (year === 'All' || item.createdAt.slice(0, 4) === year.toString()) {
        total++;
      }
    });
    return total;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputYear} onChange={handleInputChange} />
        <button type="submit">Update Year</button>
      </form>
      {annualTotals(arr, year)}
    </div>
  ); 
};

export default AnnualTotals;
