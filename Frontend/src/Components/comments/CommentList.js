import React from 'react';
import './CommentList.css';

const CommentList = ({ comments, onDelete }) => {
  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first to comment! 💭</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <div className="comment-header">
              <strong className="comment-author">👤 {comment.author?.firstName || comment.author?.username || 'Anonymous'}</strong>
              <span className="comment-date">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}</span>
            </div>
            <p className="comment-text">{comment.text}</p>
            <button 
              onClick={() => onDelete(comment._id)}
              className="comment-delete-btn"
              title="Delete comment"
            >
              🗑️ Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;

   