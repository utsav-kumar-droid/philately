import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./homepage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [imageClicks, setImageClicks] = useState({}); // Track image click counts
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // 🔄 Fetch posts
  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts");

      // ✅ Ensure posts is always an array
      const fetchedPosts = Array.isArray(res.data)
        ? res.data
        : res.data.posts && Array.isArray(res.data.posts)
        ? res.data.posts
        : [];

      setPosts(fetchedPosts);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Unable to load posts.";
      toast.error(`📛 ${message}`, { autoClose: 3000 });

      if (location.pathname !== "/") {
        setTimeout(() => navigate("/"), 3000);
      }
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // 👀 Show only 8 unless "View More" clicked
  const visiblePosts = Array.isArray(posts) ? (showAll ? posts : posts.slice(0, 8)) : [];

  const addReaction = async (postId, reactionType) => {
    try {
      await api.post(`/posts/${postId}/reactions`, { type: reactionType });
      loadPosts(); // Reload to show updated counts
    } catch (err) {
     
    }
  };

  // 🗑️ Delete post function
  const deletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await api.delete(`/posts/${postId}`);
      toast.success('✅ Post deleted successfully!');
      loadPosts(); // Reload posts list
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('❌ Failed to delete post');
    }
  };

  // 📸 Handle image click counter
  const handleImageClick = (postId) => {
    setImageClicks(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }));
  };

  return (
    <div className="home-page">
      {/* 🔘 Reload + Create Post */}
      <div className="home-buttons">
        <button
          onClick={loadPosts}
          disabled={loading}
          className="load-posts-btn"
        >
          {loading ? "Loading..." : "📥 Reload Posts"}
        </button>

        {user && (
          <button
            onClick={() => navigate("/create-post")}
            className="create-post-btn"
          >
            ➕ Create New Post
          </button>
        )}
      </div>

      {/* 🏠 Hero Section */}
      <header className="hero-section">
        <h1>
          Welcome to <span>philaConnect Blog</span>
        </h1>
        <p>
          Discover insights, experiences, and reflections shared by our
          community.
        </p>
      </header>

      {/* 📚 Blog Feed */}
      <section className="post-feed">
        {fetched && posts.length === 0 && !loading && (
          <p className="no-posts">No posts available.</p>
        )}

        {visiblePosts.map((post) => (
  
          <div className="post-preview" key={post._id}>
            {/* Featured Image */}
            {post.image && (
              <div className="post-image-container" onClick={() => handleImageClick(post._id)}>
                <img
                  src={`http://localhost:5000/${post.image}`}
                  alt={post.title}
                  className="post-image"
                  style={{ cursor: 'pointer' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('image-failed'); }}
                />
                {/* Image click counter */}
                {imageClicks[post._id] > 0 && (
                  <div className="image-click-counter">
                    👁️ {imageClicks[post._id]}
                  </div>
                )}
              </div>
            )}
            {!post.image && <div className="post-image-placeholder"></div>}

            <div className="post-content">
              <h2>{post.title}</h2>
              <p>{post.content?.slice(0, 120)}...</p>
              
              <p className="post-meta">
                ✍️ <strong>{post.author?.firstName || "Anonymous"}</strong> | 📅{" "}
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
              </p>

              {/* Reactions */}
              <div className="post-reactions">
                <button 
                  className="reaction-btn"
                  onClick={() => addReaction(post._id, 'fire')}
                  title="Fire"
                >
                  🔥 {post.reactions?.fire || 0}
                </button>
                <button 
                  className="reaction-btn"
                  onClick={() => addReaction(post._id, 'love')}
                  title="Love"
                >
                  💛 {post.reactions?.love || 0}
                </button>
                <button 
                  className="reaction-btn"
                  onClick={() => addReaction(post._id, 'heart')}
                  title="Heart"
                >
                  ❤️ {post.reactions?.heart || 0}
                </button>
                <button 
                  className="reaction-btn"
                  onClick={() => addReaction(post._id, 'laugh')}
                  title="Laugh"
                >
                  😂 {post.reactions?.laugh || 0}
                </button>
              </div>

              <Link to={`/post/${post._id}`} className="read-more">
                Read Full Post →
              </Link>

              {/* ✏️ Only Post Owner can edit */}
              {user?._id === post.author?._id && (
                <div className="post-actions">
                  <button
                    onClick={() => navigate(`/edit-post/${post._id}`)}
                    className="edit-btn"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* 👇 View More Button */}
      {Array.isArray(posts) && posts.length > 8 && !showAll && (
        <div className="view-more-container">
          <button onClick={() => setShowAll(true)} className="view-more-btn">
            👀 View More
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;



