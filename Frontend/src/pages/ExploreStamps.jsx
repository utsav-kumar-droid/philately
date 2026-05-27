// src/pages/ExploreStamps.jsx

import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useStamps } from "../Components/hooks/useStamps";
import { toast } from "react-toastify"; 
import "./ExploreStamps.css";

const ExploreStamps = () => {
  const { stamps, fetchStamps, loading } = useStamps();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveStamps, setLiveStamps] = useState([]);

  /* ======================================== */
  /* FETCH STAMPS INITIALIZATION */
  /* ======================================== */
  useEffect(() => {
    if (fetchStamps) {
      fetchStamps();
    }
  }, [fetchStamps]);

  /* ======================================== */
  /* FILTER SLIDER DECK: ONLY LIVE FOR HERO */
  /* ======================================== */
  useEffect(() => {
    if (stamps && stamps.length > 0) {
      // Isolates items configured with live flags for the hero slider region
      const filteredLive = stamps.filter(
        (stamp) => 
          stamp.isLive === true || 
          stamp.isLive === "live" || 
          stamp.isLive === "Live on Front Page"
      );
      setLiveStamps(filteredLive);
      setCurrentIndex(0); 
    }
  }, [stamps]);

  /* ======================================== */
  /* LOCAL STORAGE CART ADDITION */
  /* ======================================== */
  const handleAddToCartClick = (stamp) => {
    if (!stamp) return;

    const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const itemToFindId = stamp._id || stamp.id;
    const isAlreadyInCart = currentCart.some((item) => item.id === itemToFindId);

    if (isAlreadyInCart) {
      toast.info(`"${stamp.title}" is already in your cart!`);
      return;
    }

    const preparedCartItem = {
      id: itemToFindId,
      title: stamp.title,
      price: stamp.price,
      image: stamp.image || "https://via.placeholder.com/200",
      quantity: 1,
    };

    const updatedCart = [...currentCart, preparedCartItem];
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));

    toast.success(`🎉 ${stamp.title} added to cart!`);
  };

  /* ======================================== */
  /* SLIDER CONTROLS (Tied to liveStamps) */
  /* ======================================== */
  const nextSlide = () => {
    if (!liveStamps || !liveStamps.length) return;
    setCurrentIndex((prev) => (prev === liveStamps.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (!liveStamps || !liveStamps.length) return;
    setCurrentIndex((prev) => (prev === 0 ? liveStamps.length - 1 : prev - 1));
  };

  /* ======================================== */
  /* LOADING HANDLERS */
  /* ======================================== */
  if (loading) {
    return <div className="explore-loading">Loading stamps...</div>;
  }

  // Safety protection fallback if inventory database is entirely empty
  if (!stamps || stamps.length === 0) {
    return <div className="explore-loading">No stamps available at the moment.</div>;
  }

  const featuredStamp = liveStamps[currentIndex];

  return (
    <div className="explore-page">
      
      {/* ======================================== */}
      {/* 🔴 TOP HERO BANNER: SHOWS ONLY LIVE ITEMS */}
      {/* ======================================== */}
      {liveStamps.length === 0 ? (
        <div className="explore-hero fallback-hero">
          <div className="hero-content">
            <div className="live-badge offline">OFFLINE</div>
            <h2>No Current Live Broadcasts</h2>
            <h1>Stamp Exhibition Banner</h1>
            <p>Check the bottom collection layout to browse our complete active catalogs!</p>
          </div>
        </div>
      ) : (
        <div className="explore-hero">
          {/* LEFT CONTROLS */}
          <button className="slider-btn left" onClick={prevSlide}>
            <FaChevronLeft />
          </button>

          {/* CENTER FEATURE CARD */}
          <div className="hero-content">
            <div className="live-badge">🔴 LIVE</div>
            <h2>This ticket symbolises</h2>
            <h1>{featuredStamp?.title || "Warli Painting"}</h1>
            <p>#{featuredStamp?._id ? featuredStamp._id.slice(-8).toUpperCase() : "0000"}</p>
            <img
              src={featuredStamp?.image || "https://via.placeholder.com/300"}
              alt="featured stamp"
              className="hero-image"
            />
          </div>

          {/* RIGHT CONTROLS */}
          <button className="slider-btn right" onClick={nextSlide}>
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* ======================================== */}
      {/* 📦 BOTTOM GRID SECTION: RENDERS ALL STAMPS */}
      {/* ======================================== */}
      <h2 className="live-grid-title">🎟️ Philatelic Stamp Collection ({stamps.length})</h2>
      
      <div className="stamp-grid">
        {stamps.map((stamp) => {
          // Check if individual item is set to live to attach banner labels dynamically
          const isItemLive = stamp.isLive === true || stamp.isLive === "live" || stamp.isLive === "Live on Front Page";
          
          return (
            <div key={stamp._id || stamp.id} className="stamp-card">
              {/* Overlays live tag indicators over active banner lots only */}
              {isItemLive && <div className="card-live-dot-indicator">● LIVE</div>}
              
              <img
                src={stamp.image || "https://via.placeholder.com/200"}
                alt={stamp.title}
                className="stamp-image"
              />

              <div className="stamp-info">
                <h3>{stamp.title}</h3>
                <p>SOL {stamp.price}</p>
                
                <span className={`stock ${stamp.available ? "in-stock" : "out-of-stock"}`}>
                  {stamp.available ? "Available" : "Sold Out"}
                </span>

                <button
                  className="cart-btn"
                  onClick={() => handleAddToCartClick(stamp)}
                  disabled={!stamp.available}
                  style={{ 
                    opacity: stamp.available ? 1 : 0.6, 
                    cursor: stamp.available ? "pointer" : "not-allowed",
                    background: stamp.available ? "#f59e0b" : "#9ca3af"
                  }}
                >
                  {stamp.available ? "Add To Cart" : "Out Of Stock"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreStamps;