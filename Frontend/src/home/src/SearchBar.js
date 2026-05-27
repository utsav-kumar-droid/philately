import React, { useState } from "react";

export default function SearchBar() {
  const [filters, setFilters] = useState({
    category: "All Categories",
    country: "Country",
    year: "Year",
    query: "",
  });

  const updateField = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log("Searching:", filters);
  };

  const openCamera = () => {
    alert("📷 Camera feature coming soon");
  };

  return (
    <div className="search-wrap">
      <div className="search-row">
        <select
          className="srch-sel"
          value={filters.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          <option>All Categories</option>
          <option>Indian Stamps</option>
          <option>World Stamps</option>
        </select>

        <select
          className="srch-sel"
          value={filters.country}
          onChange={(e) => updateField("country", e.target.value)}
        >
          <option>Country</option>
          <option>India</option>
          <option>USA</option>
        </select>

        <select
          className="srch-sel"
          value={filters.year}
          onChange={(e) => updateField("year", e.target.value)}
        >
          <option>Year</option>
          <option>Pre-1947</option>
          <option>1947–1970</option>
        </select>

        <div className="srch-inp-wrap">
          <input
            className="srch-inp"
            value={filters.query}
            onChange={(e) => updateField("query", e.target.value)}
            placeholder="Search by name, theme, country..."
          />

          {/* <button
            className="srch-icon-btn srch-cam"
            onClick={openCamera}
            type="button"
          >
            📷
          </button> */}
        </div>

        <button
          className="srch-btn"
          onClick={handleSearch}
          type="button"
        >
          🔍 Search
        </button>
      </div>
    </div>
  );
}