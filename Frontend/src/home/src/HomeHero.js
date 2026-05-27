// src/home/HomeHero.js

import React from "react";
import { Link } from "react-router-dom";

import "./HomeHero.css";

export default function HomeHero() {

  return (
    <section className="home-hero">

      {/* ======================================== */}
      {/* CONTENT */}
      {/* ======================================== */}

      <div className="home-hero-content">

        {/* CHIP */}
        <div className="home-hero-chip">
          INDIA'S #1 PHILATELY COMMUNITY
        </div>

        {/* TITLE */}
        <h1 className="home-hero-title">

          Collect, Connect &

          <br />

          <span>Celebrate</span>

          <br />

          Rare Stamps

        </h1>

        {/* DESCRIPTION */}
        <p className="home-hero-description">

          From small villages to big cities —
          every philatelist in India,
          united on one platform.

        </p>

        {/* BUTTONS */}
        <div className="home-hero-buttons">

          {/* EXPLORE */}
          <Link
            to="/explore-stamps"
            className="home-primary-btn"
          >
            Explore Stamps
          </Link>

          {/* COMMUNITY */}
          <a
            href="https://chat.whatsapp.com/DP04RiT4JbZGMIEAWpf7CR?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="home-outline-btn"
          >
            Join Community
          </a>

        </div>

      </div>

    </section>
  );
}