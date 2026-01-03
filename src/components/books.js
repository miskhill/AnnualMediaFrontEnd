import { useState, useEffect } from "react";
import Filters from "./utils/filters.js";
import axios from "axios";
import AnnualTotals from "./utils/annualTotals.js";
import BookGrid from "./bookGrid.js";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    setLoading(true);
    const getBooks = async () => {
      try {
        const { data } = await axios.get(
          `${
            process.env.NODE_ENV === "development"
              ? "http://localhost:4000/api/books"
              : "https://annualmediaserver.onrender.com/api/books"
          }`
        );
        console.log(data, "render data");
        setBooks(Object.values({ ...data }));
        setLoading(false);
      } catch (err) {
        console.log(err, "<-- catch error");
        setLoading(false);
      }
    };
    getBooks();
  }, []);

  const handleFilterChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };

  const sortBooks = (items, key) => {
    const copy = [...items];

    switch (key) {
      case "year":
        return copy.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      case "rating":
        return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "createdAt":
        return copy.sort((a, b) => {
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          return bDate - aDate;
        });
      default:
        return copy.sort((a, b) => {
          const aValue = (a[key] || "").toString().toLowerCase();
          const bValue = (b[key] || "").toString().toLowerCase();
          return aValue.localeCompare(bValue);
        });
    }
  };

  useEffect(() => {
    const loweredSearch = searchTerm.trim().toLowerCase();
    const sorted = sortBooks(books, sortBy);
    const filtered = sorted.filter((book) => {
      const matchesSearch =
        loweredSearch === "" ||
        book.title?.toLowerCase().includes(loweredSearch) ||
        book.author?.toLowerCase().includes(loweredSearch) ||
        book.genre?.toLowerCase().includes(loweredSearch);

      const matchesYear =
        selectedYear === "All" ||
        (book.createdAt && book.createdAt.slice(0, 4) === selectedYear.toString());

      return matchesSearch && matchesYear;
    });

    setDisplayBooks(filtered);
  }, [books, sortBy, searchTerm, selectedYear]);

  return (
    <>
      <Filters
        id='matchesFilters'
        handleFilterChange={handleFilterChange}
        handleSortBy={handleSortBy}
        searchTerm={searchTerm}
        sortBy={sortBy}
        showAuthorOption
      />
      <div className='totals'>
        <h3>
          <AnnualTotals
            arr={books}
            year={selectedYear}
            handleYearChange={setSelectedYear}
          />
        </h3>
      </div>
      {loading ? (
        <div
          className='loading-container'
          style={{
            display: loading ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src='loading.gif' alt='Loading' />
        </div>
      ) : (
        <BookGrid books={displayBooks} />
      )}
    </>
  );
};

export default Books;
