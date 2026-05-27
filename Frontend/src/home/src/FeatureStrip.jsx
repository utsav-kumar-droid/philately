import React from "react";
import "./FeatureStrip.css";

export default function FeatureStrip() {
  const items = [
    { icon: "🌍", title: "Global Stamps", text: "190+ countries, 50,000+ listings" },
    { icon: "💳", title: "Secure Wallet", text: "Balance in sol • Blockchain network" },
    { icon: "🚚", title: "Track Orders", text: "GPS via SpeedPost & Shiprocket" },
    { icon: "🤖", title: "24/7 AI Chatbot", text: "Instant help, always online" },
  ];

  return (
    <div className="feature-strip">
      {items.map((item, i) => (
        <div key={i} className="feature-box">
          <div className="feature-icon">{item.icon}</div>
          <div>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}