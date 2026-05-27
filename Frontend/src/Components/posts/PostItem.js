// src/components/posts/PostItem.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
// import './PostItem.css';

const PostItem = ({ post, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!post) return null;

  const { _id, title, content, author, createdAt } = post;
  const snippet = content?.length > 120 ? `${content.substring(0, 120)}...` : content;
  const authorName = author?.firstName || author?.username || 'Anonymous';
  const date = new Date(createdAt).toLocaleDateString();

  const isAuthor = user && user._id === author?._id;
  const isAdmin = user?.role === 'admin';

  const handleEdit = () => {
    navigate(`/edit-post/${_id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${_id}`);
      toast.success('🗑️ Post deleted successfully!');
      if (onDelete) onDelete(_id); // Notify parent if needed
    } catch (err) {
      const message = err.response?.data?.message || '❌ Failed to delete post';
      toast.error(message);
    }
  };

  return (
    <div className="post-item">
      <Link to={`/post/${_id}`} className="post-item-link">
        <h2 className="post-item-title">{title}</h2>
        <p className="post-item-snippet">{snippet}</p>
      </Link>

      <div className="post-item-meta">
        <span className="meta-author">✍️ <strong>{authorName}</strong></span>
        <span className="meta-date">📅 {date}</span>
      </div>

      {/* Action buttons */}
      {(isAuthor || isAdmin) && (
        <div className="post-actions" style={{ marginTop: '0.5rem' }}>
          <button onClick={handleEdit} style={buttonStyle}>✏️ Edit</button>
          {isAdmin && (
            <button onClick={handleDelete} style={{ ...buttonStyle, color: 'red' }}>
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  marginRight: '10px',
  padding: '5px 10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
  background: '#f0f0f0',
};

export default PostItem;


