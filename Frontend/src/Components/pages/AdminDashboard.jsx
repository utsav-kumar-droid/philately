import React, { useEffect, useState } from "react";
import { useStamps } from "../hooks/useStamps";
import { Link } from "react-router-dom";
import { FaVolumeUp } from "react-icons/fa";
import "./Dashboard.css";

const AdminDashboard = () => {
  const {
    stamps,
    fetchStamps,
    createStamp,
    updateStamp,
    deleteStamp,
  } = useStamps();

  // Local dashboard state tracking container
  const [localStamps, setLocalStamps] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    country: "",
    year: "",
    price: "",
    image: "",
    audioUrl: "", // 🎙️ Tracking field for audio files
    available: true,
    isLive: false,
  });

  useEffect(() => {
    fetchStamps();
  }, [fetchStamps]);

  // Sync local data state with the hook whenever stamps array records update
  useEffect(() => {
    if (stamps) {
      setLocalStamps(stamps);
    }
  }, [stamps]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createStamp({
      ...form,
      year: Number(form.year),
      price: Number(form.price),
    });
    
    // Clean slate clear variables reset
    setForm({
      title: "",
      description: "",
      country: "",
      year: "",
      price: "",
      image: "",
      audioUrl: "", // 🎙️ Reset clean slate configuration
      available: true,
      isLive: false,
    });
  };

  return (
    <div className="dashboard-container">
      <h1>📮 Admin Dashboard</h1>

      {/* Admin Navigation Tabs */}
      <div className="admin-nav-tabs">
        <Link to="/admin-dashboard" className="nav-tab active">
          🎫 Stamps Management
        </Link>
        <Link to="/admin-posts" className="nav-tab">
          📝 Posts Management
        </Link>
      </div>

      {/* CREATE STAMP FORM CONTROL ROW MAP ENGINE */}
      <form onSubmit={handleSubmit} className="stamp-form">
        <input
          type="text"
          placeholder="Stamp Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price (SOL)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />
        <input
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          required
        />
        {/* 🎙️ AUDIO URL INPUT FIELD */}
        <input
          type="text"
          placeholder="Audio Track Link (.mp3 / Web Link)"
          value={form.audioUrl}
          onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
          className="audio-input-highlight"
        />
        <button type="submit" className="submit-stamp-btn">✨ Add Stamp</button>
      </form>

      {/* RENDER GRID WITH OPTIMISTIC SELECTION FIXES */}
      <div className="admin-stamp-grid">
        {localStamps.map((stamp) => (
          <div key={stamp._id} className="admin-card">
            <div className="card-image-wrapper">
              <img src={stamp.image} alt={stamp.title} />
              {stamp.audioUrl && (
                <div className="audio-attached-badge" title="Audio Stream Configured">
                  <FaVolumeUp /> Audio Live
                </div>
              )}
            </div>

            <h3>{stamp.title}</h3>

            {/* Price Editor Field Box Input */}
            <div className="input-group-label">
              <label>Price (SOL):</label>
              <input
                type="number"
                value={stamp.price || ""}
                onChange={async (e) => {
                  const targetPrice = Number(e.target.value);
                  // Optimistic state change update execution
                  setLocalStamps(prev =>
                    prev.map(s => s._id === stamp._id ? { ...s, price: targetPrice } : s)
                  );
                  await updateStamp(stamp._id, { price: targetPrice });
                }}
              />
            </div>

            {/* 🎙️ IN-LINE INVENTORY AUDIO FIELD UPDATE ENGINE */}
            <div className="input-group-label">
              <label>Audio URL Link:</label>
              <input
                type="text"
                placeholder="No audio track mapped"
                value={stamp.audioUrl || ""}
                onChange={async (e) => {
                  const targetAudio = e.target.value;
                  setLocalStamps(prev =>
                    prev.map(s => s._id === stamp._id ? { ...s, audioUrl: targetAudio } : s)
                  );
                  await updateStamp(stamp._id, { audioUrl: targetAudio });
                }}
                className="audio-card-field"
              />
            </div>

            {/* 1. STAMP STOCK AVAILABILITY SELECTION CONTROL */}
            <div className="input-group-label">
              <label>Inventory Status:</label>
              <select
                value={stamp.available === true || stamp.available === "true" ? "true" : "false"}
                onChange={async (e) => {
                  const targetAvailability = e.target.value === "true";
                  
                  // Real-time UI lock state execution loop protection block
                  setLocalStamps(prev =>
                    prev.map(s => s._id === stamp._id ? { ...s, available: targetAvailability } : s)
                  );

                  try {
                    await updateStamp(stamp._id, { available: targetAvailability });
                  } catch (err) {
                    console.error("Hook transmission error update path rejected:", err);
                    fetchStamps(); // Fallback reload sync sequence if request drops
                  }
                }}
              >
                <option value="true">Available</option>
                <option value="false">Out Of Stock</option>
              </select>
            </div>

            {/* 2. MAIN FRONT LANDING PAGE LIVE SHOW FEATURE SELECTOR */}
            <div className="input-group-label">
              <label>Visibility Setting:</label>
              <select
                value={stamp.isLive === true || stamp.isLive === "true" ? "live" : "offline"}
                onChange={async (e) => {
                  const targetLiveState = e.target.value === "live";

                  // Real-time UI lock state execution loop protection block
                  setLocalStamps(prev =>
                    prev.map(s => s._id === stamp._id ? { ...s, isLive: targetLiveState } : s)
                  );

                  try {
                    await updateStamp(stamp._id, { isLive: targetLiveState });
                  } catch (err) {
                    console.error("Hook transmission error live target rejected:", err);
                    fetchStamps(); // Fallback reload sync sequence if request drops
                  }
                }}
              >
                <option value="offline">Offline</option>
                <option value="live">🔴 Live on Front Page</option>
              </select>
            </div>

            <button
              className="delete-btn"
              onClick={() => deleteStamp(stamp._id)}
            >
              Delete Item
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;