import { useState, useEffect } from "react";
import Filters from "./utils/filters.js";
import axios from "axios";
import AnnualTotals from "./utils/annualTotals.js";
import BookGrid from "./bookGrid.js";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchBooks, setSearchBooks] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: "" });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortedArray, setSortedArray] = useState([]);
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
        console.log(err, "catch error");
      }
    };
    getBooks();
  }, []);

  const handleFilterChange = (event) => {
    const newObj = { ...filters, [event.target.name]: event.target.value };
    console.log(newObj, "newObj", filters, "filters");
    setFilters(newObj);
  };
  const handleSortBy = (event) => {
    console.log(event.target.value, "event.target.value");
    setSortBy(event.target.value);
  };

  const whichSort = (array, sortBy) => {
    if (
      sortBy === "Genre" ||
      sortBy === "Title" ||
      sortBy === "CreatedAt" ||
      sortBy === "Author"
    ) {
      return array.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1));
    } else {
      return array.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    }
  };

  useEffect(() => {
    console.log(sortBy, "sortBy");
    setSortedArray(whichSort(books, sortBy));
  }, [sortBy, books]);

  useEffect(() => {
    const regexSearch = new RegExp(filters.searchTerm, "i");
    setSearchBooks(
      (sortedArray ? sortedArray : whichSort(books, sortBy)).filter((book) => {
        return (
          regexSearch.test(book.title) &&
          (selectedYear === "All" ||
            (book.createdAt &&
              book.createdAt.slice(0, 4) === selectedYear.toString()))
        );
      })
    );
  }, [filters, sortBy, sortedArray, books, selectedYear]);

  return (
    <>
      <Filters
        id='matchesFilters'
        handleFilterChange={handleFilterChange}
        handleSortBy={handleSortBy}
        {...filters}
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
        <BookGrid
          books={
            filters.searchTerm !== "" || selectedYear !== "All"
              ? searchBooks
              : sortedArray
          }
        />
      )}
    </>
  );
};

export default Books;
