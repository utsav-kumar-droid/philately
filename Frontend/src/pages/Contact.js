// src/pages/Contact.js
import React from "react";
import "./Contact.css";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-wrapper">
        {/* Heading */}
        <h1 className="contact-title">WHAT MY CLIENTS HAVE TO SAY</h1>
        {/* <h2 className="contact-subtitle">
          1230+ Lives Transformed Through Manifestation Coaching
        </h2> */}

        {/* Testimonials */}
        <div className="testimonial">
          <p className="quote">
            “The global collection is incredible. I was able to trade vintage British colonial stamps with collectors from India and Australia.”
          </p>
          <p className="author">– Sophia Williams,UK</p>
          {/* <p className="stats">97% of customers</p> */}
        </div>

        <div className="testimonial">
          <p className="quote">
            “I found a rare 1947 Independence stamp here that I had been searching for over 6 years. This platform feels like heaven for collectors!”
          </p>
          <p className="author">–Arjun Mehta, India</p>
          {/* <p className="stats">95% on average, according to customers</p> */}
        </div>

        <div className="testimonial">
          <p className="quote">
           "As a beginner in philately, the auction section helped me learn real market values. The community is friendly and very knowledgeable.”
          </p>
          <p className="author">– Emily Johnson,"USA"</p>
          {/* <p className="stats">92% of customers</p> */}
        </div>
        <div className="testimonial">
          <p className="quote">
           "I love how easy it is to discover stamps from 190+ countries. Every week I add something unique to my collection."
          </p>
          <p className="author">– Kenji Tanaka,"Japan"</p>
          {/* <p className="stats">92% of customers</p> */}
        </div>


        {/* Contact Section */}
        <div className="contact-section">
          <h2 className="contact-subtitle">Get in Touch</h2>
          <p className="contact-text">
            Have questions or want to start your journey? Reach me directly:
          </p>

          <div className="contact-links">
            <a href="tel:+919161526633" className="contact-link">
              <FaPhoneAlt className="icon" /> +91 9161526633
            </a>
<a
  href="https://chat.whatsapp.com/DP04RiT4JbZGMIEAWpf7CR?mode=gi_t"
  target="_blank"
  rel="noopener noreferrer"
  className="contact-link whatsapp"
>
  <FaWhatsapp className="icon" /> Join Stamp Collectors Community
</a>
          </div>
        </div>
      </div>
    </div>
  );
}
