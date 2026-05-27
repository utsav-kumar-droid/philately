// src/pages/About.js
import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <div className="about-wrapper">
        <h1 className="about-title">About Me</h1>
        <h2 className="about-subtitle">My Story</h2>

        <p className="about-text">
          Hello, I’m <span className="highlight">Omkar Marathe</span>, the Founder
          and Coach of <span className="italic">"Knowledge Zenith Earth 🌎"</span>.
        </p>

        <p className="about-text">
          Over the past 3 years, I’ve had the privilege of coaching{" "}
          <span className="highlight">1,230+ individuals</span>, guiding them to
          transform their lives by tapping into the powerful universal force of
          the <span className="bold">Law of Attraction</span>. My mission is to
          introduce everyone to this incredible energy and help them create a
          life filled with abundance, joy, and purpose.
        </p>

        <p className="about-text">
          My journey with the Law of Attraction began in 2016. It was a simple
          yet life-changing moment when my brother’s friend visited our home and
          showed me <span className="italic">The Secret</span> movie on his
          mobile. I was utterly amazed by the idea that our thoughts could shape
          our reality.
        </p>

        <p className="about-text">
          That moment ignited a spark within me. I dove deep into learning,
          experimenting, and practicing the principles of manifestation. Over
          time, I achieved many of my inner desires and goals, turning my dreams
          into reality.
        </p>

        <p className="about-text">
          But my journey didn’t stop there. Seeing the profound impact this
          knowledge had on my life, I felt compelled to share it with others. I
          began helping people understand, practice, and simplify the process of
          manifestation, making it accessible and effective for everyone.
        </p>

        <p className="about-text">
          Now, it’s my passion and purpose to empower others to unlock their
          potential and achieve their dreams effortlessly.{" "}
          <span className="highlight">
            Let’s embark on this transformative journey and make your desires a
            reality! 🌟
          </span>
        </p>
      </div>
    </div>
  );
}
