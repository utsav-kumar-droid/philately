import React from "react";

const StampCard = ({ stamp, onAddToCart }) => {
  return (
    <div className="stamp-card">
      <img src={stamp.image} alt={stamp.name} />

      <h4>{stamp.name}</h4>

      <p>₹ {stamp.price}</p>

      <p>
        {stamp.available ? "✅ Available" : "❌ Out of Stock"}
      </p>

      <button
        disabled={!stamp.available}
        onClick={onAddToCart}
      >
        Add To Cart
      </button>
    </div>
  );
};
export default StampCard;