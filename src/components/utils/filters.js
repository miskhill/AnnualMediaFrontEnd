import React, { useMemo } from "react";

const Filters = ({
  handleFilterChange,
  handleSortBy,
  sortBy = "createdAt",
  searchTerm = "",
  showAuthorOption = false,
}) => {
  const sortOptions = useMemo(() => {
    const baseOptions = [
      { value: "year", label: "Year" },
      { value: "createdAt", label: "Date Added" },
      { value: "title", label: "Title" },
      { value: "genre", label: "Genre" },
      { value: "rating", label: "Rating" },
    ];

    if (showAuthorOption) {
      baseOptions.splice(3, 0, { value: "author", label: "Author" });
    }

    return baseOptions;
  }, [showAuthorOption]);

  return (
    <>
      <div
        id='filtersDiv'
        style={{
          backgroundColor: "#3b3835",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <input
          style={{
            width: "200px",
            height: "26px",
            backgroundColor: "#fff",
            color: "#000",
            opacity: "1",
            fontWeight: "800",
            margin: "10px",
            padding: "0 14px",
            borderRadius: "999px",
            border: "0",
            outline: "none",
          }}
          onChange={handleFilterChange}
          name='searchTerm'
          value={searchTerm}
          placeholder='Search Media 📖'
        />
        <select
          style={{
            border: "0",
            height: "26px",
            fontWeight: "800",
            fontSize: "12px",
            backgroundColor: "#f6f5ef",
            color: "#009F8A",
            margin: "10px",
            padding: "0 32px 0 14px",
            textAlign: "center",
            textAlignLast: "center",
            borderRadius: "999px",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            backgroundImage:
              "linear-gradient(45deg, transparent 50%, #009F8A 50%), linear-gradient(135deg, #009F8A 50%, transparent 50%)",
            backgroundPosition: "calc(100% - 16px) 10px, calc(100% - 10px) 10px",
            backgroundSize: "6px 6px, 6px 6px",
            backgroundRepeat: "no-repeat",
            outline: "none",
          }}
          onChange={handleSortBy}
          name='sortBy'
          value={sortBy}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Filters;
