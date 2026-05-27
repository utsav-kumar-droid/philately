import React, { useRef, useState, useEffect } from "react";
import { useStamps } from "../../Components/hooks/useStamps"; // Uses your custom dynamic data hook
import { FaPlay, FaPause } from "react-icons/fa";
import "./AudioNewsCard.css";

export default function AudioNewsCard() {
  const audioRef = useRef(null);
  const { stamps, fetchStamps } = useStamps(); // Fetch directly from MongoDB
  
  const [liveStamps, setLiveStamps] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState("0:00");

  useEffect(() => {
    fetchStamps();
  }, [fetchStamps]);

  // Watch your MongoDB stamps array, running anytime data updates
  useEffect(() => {
    if (stamps && stamps.length > 0) {
      // 1. Filter items that are explicitly toggled live (Kept exactly as your logic intended)
      const activeLiveItems = stamps.filter(stamp => stamp.isLive === true || stamp.isLive === "live");
      
      console.log("Active live stamp data elements found:", activeLiveItems);

      // 2. Map structural fields safely, passing down the MongoDB fields cleanly
      const formattedTracks = activeLiveItems.map((stamp) => ({
        id: stamp._id,
        rawTitle: stamp.title,
        title: `🎙 ${stamp.title} — Official Feature Audio Blog`,
        duration: stamp.year ? `Year ${stamp.year}` : "5:00",
        listens: "1,204",
        image: stamp.image || "https://via.placeholder.com/150", 
        src: stamp.audioUrl, // 🛡️ Real live URL given by the admin
      }));

      setLiveStamps(formattedTracks);

      // 3. Fallback check to establish player deck mounts if not set yet
      if (formattedTracks.length > 0 && !currentBlog) {
        setCurrentBlog(formattedTracks[0]);
      } else if (formattedTracks.length === 0) {
        setCurrentBlog(null);
      }
    }
  }, [stamps, currentBlog]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Playback block checked:", err));
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const current = audio.currentTime;
    const duration = audio.duration || 1;

    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60).toString().padStart(2, "0");

    setTime(`${mins}:${secs}`);
    setProgress((current / duration) * 100);
  };

  const switchAudio = (blog) => {
    setCurrentBlog(blog);
    setIsPlaying(false);
    setProgress(0);
    setTime("0:00");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  };

  // If no stamp is selected as live by the admin, return an empty state cleanly
  if (!currentBlog) {
    return (
      <section className="audio-news-wrapper empty-state">
        <div className="live-badge-pill">OFFLINE</div>
        <div className="audio-header">
          <h2>No Current Live Broadcasts</h2>
          <p>Check back later for stamp auctions and news updates!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="audio-news-wrapper">
      <div className="live-badge-pill">LIVE</div>

      <div className="audio-header">
        <div>
          <p className="subheader-text">LATEST FROM INDIA POST & WORLD</p>
          <h2 className="main-section-title">Stamp News & Blogs</h2>
        </div>
        <a href="/" className="view-all-anchor">View All →</a>
      </div>

      {/* ========================================================= */}
      {/* MAIN HERO AUDIO DISPLAY DECK PLAYER BLOCK                 */}
      {/* ========================================================= */}
      <div className="audio-card-layout-wrapper">
        
        {/* Dynamic Image Left Side panel for Hero Player Deck */}
        <div className="hero-player-image-aside">
          <img src={currentBlog.image} alt={currentBlog.rawTitle} />
        </div>

        <div className={`audio-card ${isPlaying ? "playing-glow" : ""}`}>
          <button className={`play-btn-circle ${isPlaying ? "pause-active" : ""}`} onClick={togglePlay}>
            {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="play-icon-offset" />}
          </button>

          <div className="audio-content">
            <h3 className="track-title-text">{currentBlog.title}</h3>
            <p className="track-meta-text">{currentBlog.duration} · {currentBlog.listens} listens · Tap to play</p>

            <div className="progress-track-wrapper">
              <div className="progress-track-bg">
                <div className="progress-fill-node" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>

          <span className="time-display">{time} / {currentBlog.duration}</span>

          <audio
            key={currentBlog.id}
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={currentBlog.src} type="audio/mpeg" />
          </audio>
        </div>
      </div>

      {/* ========================================================= */}
      {/* THE LIVE-PILE GALLERY SECTION                              */}
      {/* ========================================================= */}
      <h3 className="live-pile-title">🎙️ Active Streams ({liveStamps.length})</h3>
      
      <div className="audio-live-pile-grid">
        {liveStamps.map((blog) => (
          <div
            key={blog.id}
            className={`live-pile-item-card ${currentBlog.id === blog.id ? "selected-track" : ""}`}
            onClick={() => switchAudio(blog)}
          >
            <div className="pile-img-thumbnail">
              <img src={blog.image} alt={blog.rawTitle} />
              <span className="live-indicator-dot">●</span>
            </div>
            
            <div className="pile-text-details">
              <h4>{blog.rawTitle}</h4>
              <p>Tune in Broadcast</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}