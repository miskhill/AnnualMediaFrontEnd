import React, { useState, useEffect } from "react";
import MediaCard from "./card.js";
import { Grid } from "@mui/material";
import axios from "axios";
import AnnualTotals from "./utils/annualTotals.js";
import Filters from "./utils/filters.js";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedYear, setSelectedYear] = useState("All");

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

  useEffect(() => {
    setFilteredMovies(
      movies.filter((movie) => {
        return (
          (movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.genre.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (!movie.createdAt ||
            selectedYear === "All" ||
            movie.createdAt.slice(0, 4) === selectedYear.toString())
        );
      })
    );
  }, [movies, searchTerm, selectedYear]);

  useEffect(() => {
    console.log("Filtered Movies: ", filteredMovies);
  }, [filteredMovies]);

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
        <Grid container spacing={2}>
          {filteredMovies.length === 0 ? (
            <p>No movies found</p>
          ) : (
            filteredMovies.map((movie) => (
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
      )}
    </>
  );
};

export default Movies;
