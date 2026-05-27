// src/home1.js
import React from "react";
import HomeHero from "./src/HomeHero";
import SearchBar from "./src/SearchBar";
import HomeSections from "./src/HomeSections";

// Import your fixed, isolated global and specific stylesheets
import "./index2.css";
// import "./src/HomeSections.css";

export default function App1() {
  return (
    <div style={{ backgroundColor: "#f6f1e8", minHeight: "100vh", width: "100%" }}>
      {/* 1. Hero Block Area */}
      <HomeHero />
      
      {/* 2. Isolated Search System Bar */}
      <SearchBar />
      
      {/* 3. Lower Display Sections Grid Area */}
      <div style={{ width: "100%" }}>
        <HomeSections />
      </div>
    </div>
  );
}
