import React, { useState, useEffect } from "react";
import MediaCard from "./card.js";
import { Grid } from "@mui/material";
import axios from "axios";
import AnnualTotals from "./utils/annualTotals.js";
import Filters from "./utils/filters.js";

const Movies = () => {
  const PAGE_SIZE = 20;

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedYear, setSelectedYear] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sortMovies = (items, key) => {
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
    setLoading(true);
    axios
      .get(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:4000/api/movies"
            : "https://annualmediaserver.onrender.com/api/movies"
        }`
      )
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
        console.log(res.data, "render data");
      })
      .catch((err) => {
        console.log(err, "catch error");
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredMovies.length));
  };

  useEffect(() => {
    const loweredSearch = searchTerm.toLowerCase();
    const matches = movies.filter((movie) => {
      return (
        (movie.title.toLowerCase().includes(loweredSearch) ||
          movie.genre.toLowerCase().includes(loweredSearch)) &&
        (!movie.createdAt ||
          selectedYear === "All" ||
          movie.createdAt.slice(0, 4) === selectedYear.toString())
      );
    });

    const sortedMatches = sortMovies(matches, sortBy);
    setFilteredMovies(sortedMatches);

    const filtersActive = searchTerm.trim() !== "" || selectedYear !== "All";
    setVisibleCount(
      filtersActive
        ? sortedMatches.length
        : Math.min(sortedMatches.length, PAGE_SIZE)
    );
  }, [movies, searchTerm, selectedYear, sortBy, PAGE_SIZE]);

  useEffect(() => {
    console.log("Filtered Movies: ", filteredMovies);
  }, [filteredMovies]);

  const filtersActive = searchTerm.trim() !== "" || selectedYear !== "All";
  const moviesToDisplay = filtersActive
    ? filteredMovies
    : filteredMovies.slice(0, visibleCount);
  const showLoadMore = !filtersActive && visibleCount < filteredMovies.length;

  return (
    <>
      <Filters
        handleFilterChange={handleFilterChange}
        handleSortBy={handleSortBy}
        sortBy={sortBy}
        searchTerm={searchTerm}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          textAlign: "center",
        }}
        className="totals"
      >
        <h3 style={{ fontSize: "20px", fontWeight: "bold", margin: "0" }}>
          <AnnualTotals
            arr={movies}
            year={selectedYear}
            handleYearChange={setSelectedYear}
          />
        </h3>
      </div>

      {loading ? (
        <div
          className="loading-container"
          style={{
            display: loading ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="loading.gif" alt="Loading" />
        </div>
      ) : (
        <>
          <Grid container spacing={2}>
            {moviesToDisplay.length === 0 ? (
              <p>No movies found</p>
            ) : (
              moviesToDisplay.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                  <MediaCard
                    title={movie.title}
                    year={movie.year}
                    genre={movie.genre}
                    rating={movie.rating}
                    image={movie.poster}
                    plot={movie.plot}
                  />
                </Grid>
              ))
            )}
          </Grid>
          {showLoadMore && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "24px",
              }}
            >
              <button
                type="button"
                onClick={handleLoadMore}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#e50914",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Movies;
