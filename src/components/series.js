import React, { useState, useEffect } from "react";
import MediaCard from "./card.js";
import axios from "axios";
import AnnualTotals from "./utils/annualTotals.js";
import Filters from "./utils/filters.js";
import { Grid } from "@mui/material";

const Series = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("year");
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    setLoading(true);
    try {
      axios
        .get(`${process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api/series' : 'https://annualmediaserver.onrender.com/api/series'}`)
        .then((res) => {
          setSeries(res.data);
          setLoading(false);
        });
    } catch (err) {
      console.log(err, "catch error");
    }
  }, []);
  

  const handleFilterChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    const regexSearch = new RegExp(searchTerm, "i");
    const filtered = series
    .filter((series) => regexSearch.test(series.title) && (selectedYear === 'All' || series.year.toString() === selectedYear))
      .sort((a, b) => {
        if (sortBy === "year") {
          return b.year - a.year;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });
    setFilteredSeries(filtered);
  }, [series, searchTerm, sortBy, selectedYear]);

  return (
    <>
      <Filters
        searchTerm={searchTerm}
        handleFilterChange={handleFilterChange}
        sortBy={sortBy}
        handleSortBy={handleSortBy}
        handleYearChange={setSelectedYear}
      />
      <div
        className="totals"
        style={{
          backgroundColor: "#f5f5f5",
          color: "#8c1839",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "normal" }}>
          <AnnualTotals arr={series} year={selectedYear} />
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
          {filteredSeries.map((serie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={serie._id}>
              <MediaCard
                key={serie.id}
                title={serie.title}
                year={serie.year}
                genre={serie.genre}
                rating={serie.rating}
                image={serie.poster}
                plot={serie.plot}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Series;
