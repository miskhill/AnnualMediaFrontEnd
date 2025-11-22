import React, { useMemo } from "react";

const AnnualTotals = ({ arr, year, handleYearChange }) => {
  const yearOptions = useMemo(() => {
    const collectedYears = new Set();

    arr.forEach((item) => {
      const createdAt = item?.createdAt;
      if (!createdAt) return;
      const parsed = parseInt(createdAt.slice(0, 4), 10);
      if (!Number.isNaN(parsed)) {
        collectedYears.add(parsed);
      }
    });

    const fallbackEarliest = 2023;
    const yearsArray = [...collectedYears];
    const earliest = yearsArray.length > 0 ? Math.min(...yearsArray) : fallbackEarliest;
    const currentYear = new Date().getFullYear();
    const latestDataYear = yearsArray.length > 0 ? Math.max(...yearsArray) : currentYear;
    const latest = Math.max(latestDataYear, currentYear + 1);

    const options = [];
    for (let y = earliest; y <= latest; y += 1) {
      options.unshift(y);
    }

    return options;
  }, [arr]);

  const handleChange = (event) => {
    const { value } = event.target;
    handleYearChange(value === 'All' ? 'All' : parseInt(value, 10));
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
      <select value={year === 'All' ? 'All' : year.toString()} onChange={handleChange}>
        <option value='All'>All</option>
        {yearOptions.map((optionYear) => (
          <option key={optionYear} value={optionYear}>
            {optionYear}
          </option>
        ))}
      </select>
      {annualTotals(arr, year)}
    </div>
  ); 
};

export default AnnualTotals;
