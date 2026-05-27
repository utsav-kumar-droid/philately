import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { usePosts } from "../hooks/usePosts";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { posts, fetchPosts, deletePost } = usePosts();

  const [activeTab, setActiveTab] = useState("posts");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>📮 Dashboard</h2>

        <div
          className={`menu-item ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          📝 Posts
        </div>

        {/* <div
          className={`menu-item ${activeTab === "stamps" ? "active" : ""}`}
          onClick={() => setActiveTab("stamps")}
        >
          📮 Stamps
        </div> */}
      </div>

      {/* MAIN */}
      <div className="main-content">
        {activeTab === "posts" && (
          <>
            <div className="dashboard-header">
              <h1>📝 All Posts</h1>

              <button
                className="create-post-btn"
                onClick={() => navigate("/create-post")}
              >
                ➕ Create Post
              </button>
            </div>

            {!posts.length ? (
              <p>No posts available.</p>
            ) : (
              <div className="post-grid">
                {posts.map((post) => {
                  const isAuthor = user?._id === post.author?._id;
                  const canEdit = isAuthor || isAdmin;
                  const imageSrc = post.image
                    ? post.image.startsWith("http")
                      ? post.image
                      : `http://localhost:5000/${post.image}`
                    : null;

                  return (
                    <div key={post._id} className="post-card">
                      {imageSrc && (
                        <div className="post-card-image">
                          <img
                            src={imageSrc}
                            alt={post.title}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <h3>{post.title}</h3>
                      <p>{post.content?.slice(0, 100)}...</p>
                      <small>
                        ✍️ {post.author?.firstName || "Anonymous"}
                      </small>

                      {canEdit && (
                        <div className="post-actions">
                          <button
                            onClick={() => navigate(`/edit-post/${post._id}`)}
                            className="edit-btn"
                          >
                            <FaEdit /> Edit
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => deletePost(post._id)}
                              className="delete-btn"
                            >
                              <FaTrash /> Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* {activeTab === "stamps" && (
          <div>
            <h1>📮 Manage Stamps</h1>
            <p>🚧 Build proper UI (not prompt-based)</p>
          </div>
        )} */}
      </div>
    </div>
  );
};
export default Dashboard;




