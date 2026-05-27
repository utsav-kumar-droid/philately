import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AdminPostsManager.css';

const AdminPostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts');
      const fetchedPosts = Array.isArray(res.data)
        ? res.data
        : res.data.posts && Array.isArray(res.data.posts)
        ? res.data.posts
        : [];
      setPosts(fetchedPosts);
    } catch (err) {
      toast.error('❌ Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      toast.success('✅ Post deleted!');
      fetchAllPosts();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('❌ Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-posts-container">
      {/* Header */}
      <div className="admin-header">
        <h1>📝 Posts Management</h1>
        <p>Manage all blog posts in the system</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{posts.length}</div>
          <div className="stat-label">Total Posts</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-search">
        <input
          type="text"
          placeholder="🔍 Search posts by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={fetchAllPosts} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {/* Posts Table */}
      <div className="admin-posts-table">
        {loading ? (
          <div className="loading-state">⏳ Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <p>📭 No posts found</p>
          </div>
        ) : (
          <div className="posts-list">
            {filteredPosts.map((post) => (
              <div key={post._id} className="post-row">
                {/* Post Info */}
                <div className="post-info">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-author">
                    ✍️ {post.author?.firstName || 'Anonymous'}
                  </p>
                  <p className="post-date">
                    📅 {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                  <p className="post-preview">
                    {post.content?.slice(0, 80)}...
                  </p>
                </div>

                {/* Post Stats */}
                <div className="post-stats">
                  <div className="stat">
                    🔥 <span>{post.reactions?.fire || 0}</span>
                  </div>
                  <div className="stat">
                    💛 <span>{post.reactions?.love || 0}</span>
                  </div>
                  <div className="stat">
                    ❤️ <span>{post.reactions?.heart || 0}</span>
                  </div>
                  <div className="stat">
                    😂 <span>{post.reactions?.laugh || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="post-actions">
                  <button
                    onClick={() => navigate(`/post/${post._id}`)}
                    className="action-btn view-btn"
                    title="View post"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="action-btn delete-btn"
                    title="Delete post"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPostsManager;
