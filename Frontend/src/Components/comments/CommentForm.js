import React, { useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './CommentForm.css';

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    try {
      setLoading(true);
      const res = await api.post(`/comments/${postId}`, { text });
      addComment(res.data);
      setText('');
    } catch (err) {
      console.error('Failed to add comment', err);
      toast.error('❌ Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts... 💭"
        className="comment-textarea"
        rows="3"
        disabled={loading}
      />
      <button 
        type="submit" 
        className="comment-submit-btn"
        disabled={loading || !text.trim()}
      >
        {loading ? '⏳ Posting...' : '💬 Post Comment'}
      </button>
    </form>
  );
};

export default CommentForm;

