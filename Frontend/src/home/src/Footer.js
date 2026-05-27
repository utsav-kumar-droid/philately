import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FaRegNewspaper } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Left side */}
        <div className="footer-left">
          <h3 className="footer-title">
            Knowledge Zenith Earth 🌍
          </h3>
          <p><strong>Stay Connected</strong><br />With us</p>
        </div>

        {/* Right side */}
        <div className="footer-right">
          <div className="footer-icons">
            <FaRegNewspaper className="footer-icon" />
            <FaYoutube className="footer-icon" />
            <FaFacebook className="footer-icon" />
            <FaXTwitter className="footer-icon" />
            <FaInstagram className="footer-icon" />
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="footer-bottom">
        <p>© 2025 Knowledge Zenith Earth. All rights reserved.</p>
      </div>
    </footer>
  );
}
