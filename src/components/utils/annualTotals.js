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
    if (handleYearChange) {
      handleYearChange(value === "All" ? "All" : parseInt(value, 10));
    }
  };

  const totalForYear = useMemo(() => {
    let total = 0;
    arr.forEach((item) => {
      const createdAtYear = item?.createdAt?.slice(0, 4);
      if (year === "All" || createdAtYear === year.toString()) {
        total++;
      }
    });
    return total;
  }, [arr, year]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        flexWrap: "wrap",
      }}
    >
      <select
        value={year === "All" ? "All" : year.toString()}
        onChange={handleChange}
        style={{
          minWidth: "104px",
          height: "36px",
          padding: "0 36px 0 16px",
          borderRadius: "999px",
          border: "0",
          backgroundColor: "#f6f5ef",
          color: "#8c1839",
          fontWeight: "800",
          fontSize: "14px",
          textAlign: "center",
          textAlignLast: "center",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, #8c1839 50%), linear-gradient(135deg, #8c1839 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 18px) 14px, calc(100% - 12px) 14px",
          backgroundSize: "6px 6px, 6px 6px",
          backgroundRepeat: "no-repeat",
          boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value='All'>All</option>
        {yearOptions.map((optionYear) => (
          <option key={optionYear} value={optionYear}>
            {optionYear}
          </option>
        ))}
      </select>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 14px 8px 10px",
          borderRadius: "999px",
          background:
            "linear-gradient(135deg, rgba(229, 9, 20, 0.18), rgba(140, 24, 57, 0.2))",
          color: "#8c1839",
          boxShadow: "0 10px 24px rgba(0, 0, 0, 0.16)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "34px",
            height: "34px",
            padding: "0 10px",
            borderRadius: "999px",
            backgroundColor: "#e50914",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "800",
            lineHeight: 1,
          }}
        >
          {totalForYear}
        </span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}
        >
          {year === "All" ? "Total Added" : `Added In ${year}`}
        </span>
      </div>
    </div>
  );
};

export default AnnualTotals;
