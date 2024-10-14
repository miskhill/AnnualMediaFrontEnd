import React from "react";

const Filters = ({ handleFilterChange, handleSortBy, sortBy, searchTerm }) => {
  return (
    <>
      <div
        id='filtersDiv'
        style={{
          backgroundColor: "#3b3835",
          display: "flex",
          justifyContent: "center",
          alignItems: "space-between",
        }}
      >
        <input
          style={{
            width: "200px",
            height: "26px",
            backgroundColor: "#fff",
            color: "#000",
            opacity: '1',
            fontWeight: '800',
            margin: '10px',
          }}
          onChange={handleFilterChange}
          name='searchTerm'
          value={searchTerm}
          placeholder='Search Media 📖'
        />
        <select style={{
          border: '0',
          // position: 'absolute',
          height: '26px',
          fontWeight: '800',
          fontSize: '12px',
          backgroundColor: '#f6f5ef',
          color: '#009F8A',
          margin: '10px',
        } } onChange={handleSortBy} name='sortBy' value={sortBy}>
          <option value='year'>Year</option>
          <option value='createdAt'>Date Added</option>
          <option value='title'>Title</option>
          <option value='author'>Author</option>
          <option value='genre'>Genre</option>
          <option value='rating'>Rating</option>
        </select>
      </div>
    </>
  );
};

export default Filters;
