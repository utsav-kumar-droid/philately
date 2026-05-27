// src/App.js

import React from "react";
import Cart from "./Components/pages/Cart";

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ======================================== */
/* LAYOUT COMPONENTS */
/* ======================================== */

import Navbar from "./Components/layout/Navbar";
import Footer from "./Components/layout/Footer";
import ChatBot from "./Components/layout/Chatbot";

/* ======================================== */
/* HOME */
/* ======================================== */

import App1 from "./home/home1";

/* ======================================== */
/* PAGES */
/* ======================================== */

import Homepage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProfilePage from "./pages/ProfilePage";
import ExploreStamps from "./pages/ExploreStamps";

/* ======================================== */
/* AUTH */
/* ======================================== */

import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";

/* ======================================== */
/* POSTS */
/* ======================================== */

import Post from "./Components/posts/Post";
import PostForm from "./Components/posts/PostForm";
import EditPost from "./Components/posts/EditPost";

/* ======================================== */
/* DASHBOARDS */
/* ======================================== */

import Dashboard from "./Components/pages/Dashboard";
import AdminDashboard from "./Components/pages/AdminDashboard";
import AdminPostsManager from "./Components/pages/AdminPostsManager";
import UserDashboard from "./Components/pages/UserDashboard";

/* ======================================== */
/* ROUTE PROTECTION */
/* ======================================== */

import PrivateRoute from "./Components/routing/PrivateRoute";

/* ======================================== */
/* TRACK ORDER */
/* ======================================== */

import TrackingCard from "./home/src/TrackingCard";

const App = () => {

  const location = useLocation();

  /* ======================================== */
  /* HIDE NAVBAR + FOOTER */
  /* ======================================== */

  const hideLayoutRoutes = [
    "/login",
    "/register",
  ];

  const hideLayout =
    hideLayoutRoutes.includes(
      location.pathname
    );

  /* ======================================== */
  /* PAGE NOT FOUND */
  /* ======================================== */

  const PageNotFound = () => (
    <div
      style={{
        textAlign: "center",
        padding: "120px 20px",
        minHeight: "80vh",
      }}
    >
      <h2>404 - Page Not Found</h2>

      <p>
        The page you are looking for
        doesn't exist.
      </p>
    </div>
  );

  return (
    <>
      <div className="app-container">

        {/* NAVBAR */}
        {!hideLayout && <Navbar />}

        {/* MAIN */}
        <main
          className="main-content"
          style={{
            minHeight: "80vh",
            width:"100vw",
            paddingTop: hideLayout
              ? "0"
              : "72px",
          }}
        >

          <Routes>

            {/* HOME */}
            <Route
              path="/"
              element={<App1 />}
            />

            {/* STAMPS */}
            <Route
              path="/explore-stamps"
              element={<ExploreStamps />}
            />

            {/* BLOGS */}
            <Route
              path="/blogs"
              element={<Homepage />}
            />

            {/* ABOUT */}
            <Route
              path="/about"
              element={<About />}
            />

            {/* CONTACT */}
            <Route
              path="/contact"
              element={<Contact />}
            />

            {/* TRACK ORDER */}
            <Route
              path="/track"
              element={<TrackingCard />}
            />
            {/* CART */}
<Route path="/cart" element={<Cart />} />

            {/* AUTH */}
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* POSTS */}
            <Route
              path="/post/:id"
              element={<Post />}
            />

            {/* ======================================== */}
            {/* PRIVATE ROUTES */}
            {/* ======================================== */}

            <Route element={<PrivateRoute />}>

              {/* MAIN DASHBOARD */}
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              {/* PROFILE */}
              <Route
                path="/profile"
                element={<ProfilePage />}
              />

              {/* CREATE POST */}
              <Route
                path="/create-post"
                element={<PostForm />}
              />

              {/* EDIT POST */}
              <Route
                path="/edit-post/:id"
                element={<EditPost />}
              />

              {/* USER DASHBOARD */}
              <Route
                path="/user-dashboard"
                element={<UserDashboard />}
              />

              {/* ADMIN DASHBOARD */}
              <Route
                path="/admin-dashboard"
                element={<AdminDashboard />}
              />

              {/* ADMIN POSTS MANAGER */}
              <Route
                path="/admin-posts"
                element={<AdminPostsManager />}
              />

            </Route>

            {/* 404 */}
            <Route
              path="*"
              element={<PageNotFound />}
            />

          </Routes>

        </main>

        {/* FOOTER */}
        {!hideLayout && <Footer />}

      </div>

      {/* CHATBOT */}
      {!hideLayout && <ChatBot />}

      {/* TOAST */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
      />
    </>
  );
};

export default App;











