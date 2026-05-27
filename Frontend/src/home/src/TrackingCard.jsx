import React, { useState } from "react";
import "./TrackingCard.css";

const mockOrders = {
  "SC-2024-8821": {
    service: "SpeedPost",
    item: "Mahatma Gandhi 1948 ×2",
    steps: [
      { icon: "✔", title: "Order Confirmed", sub: "Mar 1, 2024 · 10:30 AM", done: true },
      { icon: "✔", title: "Packed & Dispatched", sub: "Mar 2 · Delhi GPO", done: true },
      { icon: "📍", title: "In Transit — Bhopal Hub", sub: "Estimated arrival: Mar 4", active: true },
      { icon: "🏠", title: "Out for Delivery", sub: "Estimated: Tomorrow 10 AM" }
    ]
  }
};

export default function TrackingCard() {
  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState(mockOrders["SC-2024-8821"]);
  const [error, setError] = useState("");

  const handleTrack = () => {
    const result = mockOrders[trackingId.trim()];
    if (result) {
      setOrder(result);
      setError("");
    } else {
      setError("Tracking ID not found");
      setOrder(null);
    }
  };

  return (
    <section className="tracking-wrap" id="track-section">
      <p className="tracking-label">REAL-TIME GPS</p>
      <h2 className="tracking-title">Track Your Order</h2>

      {order && (
        <div className="tracking-card">
          <h4>
            ORDER #{trackingId || "SC-2024-8821"} · {order.service}
          </h4>
          <p className="tracking-item">{order.item}</p>

          <div className="tracking-steps">
            {order.steps.map((step, index) => (
              <div className="tracking-step" key={index}>
                <div
                  className={`step-icon ${
                    step.done ? "done" : step.active ? "active" : ""
                  }`}
                >
                  {step.icon}
                </div>
                <div>
                  <h5>{step.title}</h5>
                  <p>{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="track-form">
        <h3>TRACK ANY ORDER</h3>
        <div className="track-input-wrap">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. SC-2024-8821)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button onClick={handleTrack}>Track Now</button>
        </div>
        {error && <p className="track-error">{error}</p>}
      </div>
    </section>
  );
}