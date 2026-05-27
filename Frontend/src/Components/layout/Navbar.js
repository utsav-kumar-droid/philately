import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  FaShoppingCart,
  FaUserCircle,
  FaWallet,
  FaBell,
  FaTachometerAlt,
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Tracks active page configurations
  const [cartCount, setCartCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

const [stamps] = useState(() => {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
});

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartCount(cart.length);
    };

    // Initial parsing
    updateCartCount();

    // Context synchronization link listeners
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar" aria-label="Main Navigation">

        {/* 🔰 Brand Node (60% Base Integration) */}
        <Link className="nav-brand" to="/">
          <span className="brand-icon" role="img" aria-label="postbox">📮</span>
          <span className="brand-name">
            Stamp<span className="brand-accent">Collector</span>
          </span>
        </Link>

        {/* 🔗 Center Links (30% Structural Layout Configuration) */}
        <ul className="nav-links">
          <li>
            <Link 
              to="/explore-stamps" 
              className={location.pathname === '/explore-stamps' ? 'active-link' : ''}
            >
              Explore Stamps
            </Link>
          </li>
          <li>
            <Link 
              to="/track" 
              className={location.pathname === '/track' ? 'active-link' : ''}
            >
              Track Order
            </Link>
          </li>
          <li>
            <Link
              to="/"
              onClick={() => {
                setTimeout(() => {
                  document.getElementById('games')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }, 100);
              }}
            >
              Games
            </Link>
          </li>
          <li>
            <Link 
              to="/blogs" 
              className={location.pathname === '/blogs' ? 'active-link' : ''}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={location.pathname === '/contact' ? 'active-link' : ''}
            >
              Contact
            </Link>
          </li>

          {/* 👑 Admin Context Check */}
          {user?.role === 'admin' && (
            <li>
              <Link 
                to="/admin-dashboard" 
                className={location.pathname === '/admin-dashboard' ? 'active-link' : ''}
              >
                Admin Panel
              </Link>
            </li>
          )}

          {/* 👤 User Context Check */}
          {user?.role === 'user' && (
            <li>
              <Link 
                to="/user-dashboard" 
                className={location.pathname === '/user-dashboard' ? 'active-link' : ''}
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* ⚙️ Action Control Panel (10% Focus Component Triggers) */}
        <div className="nav-actions">

          {/* 💳 Digital Wallet Node */}
          <a
            href={user ? 'https://wallet-3ro.pages.dev/' : '/login'}
            target={user ? '_blank' : '_self'}
            rel="noreferrer"
            className="nav-wallet-btn"
            title="Access Wallet Terminal"
          >
            <FaWallet />
          </a>

          {/* 🛒 Shopping Line Matrix */}
          <Link
            to={user ? '/cart' : '/login'}
            className="nav-icon-btn"
            title="Open Checkout Basket"
          >
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="cart-count-badge animate-pop">{cartCount}</span>
            )}
          </Link>

          {/* 🔔 System Alerts Panel */}
          <button
  className="nav-icon-btn alert-active"
  title="View System Notifications"
  onClick={() => setShowNotifications(!showNotifications)}
>
  <FaBell />
  <span className="notification-pulse"></span>
</button>

          {/* 📊 Fast Dashboard Relay Link */}
          {user && (
            <Link
              to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
              className="nav-icon-btn secondary-shortcut"
              title="Quick Dashboard Access"
            >
              <FaTachometerAlt />
            </Link>
          )}

          {/* 👤 Account Menu Split Map */}
          {user ? (
            <div className="auth-profile-cluster">
              <Link to="/profile" className="avatar-anchor" title="View Account Settings">
                {user?.avatar ? (
                  <img src={user.avatar} alt="User Avatar" className="navbar-avatar" />
                ) : (
                  <FaUserCircle className="fallback-avatar-icon" />
                )}
              </Link>
              <span className="user-greeting">Hi, {user.firstName}</span>
              <button onClick={handleLogout} className="auth-action-btn logout-variant">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-button-group">
              <Link to="/login" className="auth-action-btn login-variant">
                Login
              </Link>
              <Link to="/register" className="auth-action-btn register-variant">
                Register
              </Link>

            </div>
          )}
          {showNotifications && (
  <div className="notification-panel">

    <div className="notification-header">
      <h3>Notifications</h3>

      <button
        className="close-btn"
        onClick={() => setShowNotifications(false)}
      >
        ✕
      </button>
    </div>

    <div className="notification-body">

      {stamps.length > 0 ? (
        stamps.map((stamp, index) => (
          <div
            key={index}
            className="notification-item"
          >

            <img
              src={stamp.image}
              alt={stamp.name}
              className="stamp-image"
            />

            <div className="stamp-info">
              <h4>{stamp.name}</h4>

              <p>
                Price: ₹{stamp.price}
              </p>

              <p>
                Quantity: {stamp.quantity || 1}
              </p>

            </div>

          </div>
        ))
      ) : (
        <div className="notification-empty">

          <FaBell className="big-bell" />

          <h2>
            Your notifications live here
          </h2>

          <p>
            No stamp notifications available.
          </p>

        </div>
      )}

    </div>

  </div>
)}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;