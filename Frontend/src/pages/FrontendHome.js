// src/pages/FrontendHome.js
import React from "react";

// Sections
import Firstpage from "../home/src/Firstpage";
import Secondpage from "../home/src/Secondpage";
import Video from "../home/src/Video";
import Ratepage from "../home/src/Ratepage";
import Footer from "../home/src/Footer";

export default function FrontendHome() {
  return (
    <div>
      {/* Hero Section */}
      <Firstpage />

      {/* About + Upcoming Workshops */}
      <Secondpage />

      {/* Discourses Videos */}
      <Video />

      {/* Rate Us Section */}
      <Ratepage />

      {/* Footer */}
      <Footer />
    </div>
  );
}
