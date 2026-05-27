import React from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CommentItem = ({ comment, onDelete }) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/comments/${comment._id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      if (onDelete) onDelete(comment._id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className="comment-item">
      <p className="comment-content">"{comment.content}"</p>
      <div className="comment-meta">
        <span>By: <strong>{comment.username}</strong></span>
        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      {user?.id === comment.author && (
        <button className="comment-delete-btn" onClick={handleDelete}>
          Delete
        </button>
      )}
    </div>
  );
};

export default CommentItem;
