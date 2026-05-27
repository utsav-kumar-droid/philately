import React from "react";
import "./footer.css";


export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-grid">

        {/* Brand */}
        <div>
          <div className="footer-brand-name">
            📮 Stamp<span>Collector</span>
          </div>

          <div className="footer-brand-desc">
            India's National Web Community of Philatelists — connecting
            collectors from every corner of the country. Buy, sell, track,
            learn and celebrate the art of stamp collecting.
          </div>

          <div className="footer-contact-list">
            <a href="tel:8602826567">📞 +91 86028 26567</a>
            <a href="mailto:support@stampcollector.in">
              ✉️ support@stampcollector.in
            </a>
            <a href="#">
              📍 India Post HQ, New Delhi — 110001
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <div className="ftr-hdg">Explore</div>
          <ul className="ftr-links">
            <li><a href="#stamps">Featured Stamps</a></li>
            <li><a href="#auctions">Live Auctions</a></li>
            <li><a href="#updates">Stamp Blog</a></li>
            <li><a href="#">New Releases</a></li>
            <li><a href="#">Rare & Vintage</a></li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <div className="ftr-hdg">Community</div>
          <ul className="ftr-links">
            <li><a href="#community">Forum</a></li>
            <li><a href="#games">Games & Quizzes</a></li>
            <li><a href="#games">Stamp Runner</a></li>
            <li><a href="#games">Leaderboard</a></li>
            <li><a href="#">Events & Meets</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <div className="ftr-hdg">Services</div>
          <ul className="ftr-links">
            <li><a href="#track-section">Track Order</a></li>

            {/* FIXED onclick → React way */}
            <li>
              <button className="link-btn" onClick={() => alert("Open Payment")}>
                Wallet & Payments
              </button>
            </li>

            <li>
              <button className="link-btn" onClick={() => alert("Open Camera")}>
                Stamp Identifier AI
              </button>
            </li>

            <li><a href="#">Logistics — Shiprocket</a></li>
            <li><a href="#">Authentication & QR</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div>
          © 2024 StampCollector · India's National Philately Platform
        </div>
        <div className="india-pride">
          🇮🇳 Made with ❤️ in India
        </div>
      </div>
    </footer>
  );
}


