// src/Components/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { 
  FaBoxOpen, 
  FaWallet, 
  FaMapMarkerAlt, 
  FaHeart, 
  FaUserCircle, 
  FaChevronRight 
} from "react-icons/fa";
import './UserDashboard.css' // Ensure to style accordingly

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");

  // Stateful tracking systems
  const [orders, setOrders] = useState([]);
  const [walletBalance, setWalletBalance] = useState(5000); // Sample starting balance
  const [wishlist, setWishlist] = useState([]);
  const [address, setAddress] = useState({
    street: "123 Main Street",
    city: "Bhopal",
    state: "Madhya Pradesh",
    zip: "462001",
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Load localized info on render
// Replace your component's first useEffect hook with this dynamic reader:
 // Load localized info on render & Handle confirmed checkout logic
  useEffect(() => {
    // 1. Pull historical orders that were already confirmed in the past
    let existingOrders = JSON.parse(localStorage.getItem("confirmedOrders")) || [];

    // 2. Listen to URL queries to see if we just landed from a successful payment redirect
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get("payment");

    if (paymentStatus === "success") {
      // Pull items directly from the un-cleared active cart
      const paidCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      if (paidCartItems.length > 0) {
        // Format the new confirmed items
        const newConfirmedOrders = paidCartItems.map((item) => {
          const isImageBroken = !item.image || item.image.includes("5tj6S7Ol");
          return {
            id: `${item.id}-${Date.now()}`, // unique timestamp id to avoid duplicate React keys
            title: item.title,
            price: item.price,
            quantity: item.quantity || 1,
            image: isImageBroken 
              ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60" 
              : item.image,
            status: "Shipped",
          };
        });

        // Merge new confirmed purchases with old historical purchases safely
        existingOrders = [...newConfirmedOrders, ...existingOrders];
        localStorage.setItem("confirmedOrders", JSON.stringify(existingOrders));

        // PAYMENT CONFIRMED: Now it is safe to remove active elements from the cart!
        localStorage.removeItem("cartItems");
        
        toast.success("🎉 Payment verified! Your order has been placed.");
      }

      // Clean the URL address bar parameters so refreshing the browser won't duplicate items
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Update your dashboard state tracking
    setOrders(existingOrders);

    // 3. Load Wishlist configurations safely
    const savedWishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    setWishlist(savedWishlist);

    // 4. Load saved custom address configuration profile details
    const savedAddress = JSON.parse(localStorage.getItem("userAddress"));
    if (savedAddress) setAddress(savedAddress);
  }, []); // Runs once on dashboard mount// Runs once on dashboard mount

  /* ======================================== */
  /* ADDRESS UPDATE OPERATIONS */
  /* ======================================== */
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const saveAddressToProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("userAddress", JSON.stringify(address));
    setIsEditingAddress(false);
    toast.success("🏠 Delivery Address updated successfully!");
  };

  /* ======================================== */
  /* REMOVE WISHLIST ITEM */
  /* ======================================== */
  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlistItems", JSON.stringify(updated));
    toast.info("Item removed from wishlist");
  };

  return (
    <div className="user-dashboard-container">
      
      {/* 🧭 LEFT SIDEBAR */}
      <div className="user-sidebar">
        <div className="user-profile-summary">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="dashboard-avatar" />
          ) : (
            <FaUserCircle className="dashboard-avatar-fallback" />
          )}
          <h3>{user?.firstName ? `Hi, ${user.firstName}` : "Stamp Collector"}</h3>
          <p className="user-role-badge">{user?.role || "Collector"}</p>
        </div>

        <nav className="sidebar-menu">
          <button 
            className={`menu-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaBoxOpen /> My Orders
          </button>
          <button 
            className={`menu-btn ${activeTab === "wallet" ? "active" : ""}`}
            onClick={() => setActiveTab("wallet")}
          >
            <FaWallet /> Wallet
          </button>
          <button 
            className={`menu-btn ${activeTab === "address" ? "active" : ""}`}
            onClick={() => setActiveTab("address")}
          >
            <FaMapMarkerAlt /> Address
          </button>
          <button 
            className={`menu-btn ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            <FaHeart /> Wishlist
          </button>
        </nav>
      </div>

      {/* 🖥️ RIGHT CONTENT REGION */}
      <div className="user-main-content">
        
        {/* TAB 1: MY ORDERS */}
        {activeTab === "orders" && (
          <div className="dashboard-section">
            <h2>📦 My Orders</h2>
            {orders.length === 0 ? (
              <div className="empty-state">
                <p>You haven't placed any orders yet.</p>
                <button onClick={() => navigate("/explore-stamps")} className="shop-now-btn">
                  Explore Stamps
                </button>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map((order) => (
                  <div key={order.id} className="order-item-card">
                    <img src={order.image} alt={order.title} className="order-img" />
                    <div className="order-details">
                      <h4>{order.title}</h4>
                      <p className="price-tag">₹ {order.price}</p>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status === "Shipped" ? "🚚 Shipped" : "✅ Delivered"}
                      </span>
                      <button onClick={() => navigate("/track")} className="track-action-btn">
                        Track Order <FaChevronRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WALLET */}
        {activeTab === "wallet" && (
          <div className="dashboard-section">
            <h2>💳 Digital Wallet Balance</h2>
            <div className="wallet-card-display">
              <p>Available Balance</p>
              <h1>₹ {walletBalance.toLocaleString("en-IN")}</h1>
              <small>Account Holder: {user?.firstName || "User"} {user?.lastName || ""}</small>
            </div>
            <button 
              className="add-funds-btn" 
              onClick={() => window.location.href = "https://wallet-3ro.pages.dev/"}
            >
              Manage External Wallet Connection
            </button>
          </div>
        )}

        {/* TAB 3: ADDRESS MANAGEMENT */}
        {activeTab === "address" && (
          <div className="dashboard-section">
            <h2>🏠 Shipping Destinations</h2>
            {!isEditingAddress ? (
              <div className="address-read-mode">
                <div className="address-box">
                  <p><strong>Street:</strong> {address.street}</p>
                  <p><strong>City:</strong> {address.city}</p>
                  <p><strong>State:</strong> {address.state}</p>
                  <p><strong>Zip Code:</strong> {address.zip}</p>
                </div>
                <button onClick={() => setIsEditingAddress(true)} className="edit-addr-btn">
                  Modify Destination Address
                </button>
              </div>
            ) : (
              <form onSubmit={saveAddressToProfile} className="address-edit-form">
                <div className="form-group">
                  <label>Street Address</label>
                  <input type="text" name="street" value={address.street} onChange={handleAddressChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={address.city} onChange={handleAddressChange} required />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={address.state} onChange={handleAddressChange} required />
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input type="text" name="zip" value={address.zip} onChange={handleAddressChange} required />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-addr-btn">Save Changes</button>
                  <button type="button" onClick={() => setIsEditingAddress(false)} className="cancel-addr-btn">Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="dashboard-section">
            <h2>❤️ My Saved Wishlist</h2>
            {wishlist.length === 0 ? (
              <p className="no-items">Your saved product inventory lists are currently empty.</p>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map((item) => (
                  <div key={item.id} className="wishlist-item-card">
                    <img src={item.image} alt={item.title} />
                    <h4>{item.title}</h4>
                    <p>₹ {item.price}</p>
                    <div className="wishlist-actions">
                      <button onClick={() => navigate("/cart")} className="move-to-cart-btn">Buy Now</button>
                      <button onClick={() => removeFromWishlist(item.id)} className="remove-wish-btn">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;