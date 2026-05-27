import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Post.css';

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await api.get(`/posts/${id}`);
        if (postRes?.data?.post) setPost(postRes.data.post);
        else if (postRes?.data) setPost(postRes.data);
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsRes = await api.get(`/comments/${id}`);
        if (Array.isArray(commentsRes?.data)) setComments(commentsRes.data);
      } catch (err) {
        console.warn('Comments failed to load:', err);
      }
    };

    fetchData();
    fetchComments();
  }, [id]);

  const addComment = (newComment) => setComments(prev => [...prev, newComment]);
  const deleteComment = (commentId) => setComments(prev => prev.filter(c => c._id !== commentId));

  const addReaction = async (reactionType) => {
    try {
      const response = await api.post(`/posts/${id}/reactions`, { type: reactionType });
      if (response?.data?.post) {
        setPost(response.data.post);
      } else {
        setPost((prev) => ({
          ...prev,
          reactions: {
            ...prev.reactions,
            [reactionType]: (prev.reactions?.[reactionType] || 0) + 1,
          },
        }));
      }
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success("✅ Post deleted!");
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("❌ Failed to delete post.");
    }
  };

  const handleEditPost = () => navigate(`/edit-post/${id}`);

  if (loading) return <div className="post-status-loading">⏳ Loading post...</div>;
  if (error) return <div className="post-status-error">❌ {error}</div>;
  if (!post) return <div className="post-status-not-found">⚠️ Post not found.</div>;

  const reactions = post.reactions || {
    fire: 0,
    love: 0,
    heart: 0,
    laugh: 0,
    wow: 0,
    sad: 0,
  };

  return (
    <div className="post-page-wrapper">
      {/* Back Button */}
      <button className="post-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="post-page-container">
        <div className="post-page-card">
          {/* Post Title */}
          <h1 className="post-page-title">{post.title || 'Untitled'}</h1>

          {/* Featured Image */}
          {post.image ? (
            <div className="post-featured-image">
              <img 
                src={`http://localhost:5000/${post.image}`}
                alt={post.title}
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('image-failed'); }}
              />
            </div>
          ) : (
            <div className="post-featured-image-placeholder"></div>
          )}

          {/* Post Content */}
          <p className="post-page-content">{post.content || 'No content available.'}</p>

          {/* Meta Info */}
          <div className="post-page-meta">
            <span className="post-meta-author">✍️ {post.author?.firstName || post.author?.username || 'Anonymous'}</span>
            <span className="post-meta-date">📅 {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}</span>
          </div>

          {/* Reactions */}
          <div className="post-reactions-section">
            <span className="reactions-label">React:</span>
            <div className="post-reactions">
              <button className="reaction-btn" onClick={() => addReaction('fire')} title="Fire">
                🔥 <span>{reactions.fire}</span>
              </button>
              <button className="reaction-btn" onClick={() => addReaction('love')} title="Love">
                💛 <span>{reactions.love}</span>
              </button>
              <button className="reaction-btn" onClick={() => addReaction('heart')} title="Heart">
                ❤️ <span>{reactions.heart}</span>
              </button>
              <button className="reaction-btn" onClick={() => addReaction('laugh')} title="Laugh">
                😂 <span>{reactions.laugh}</span>
              </button>
              <button className="reaction-btn" onClick={() => addReaction('wow')} title="Wow">
                😮 <span>{reactions.wow}</span>
              </button>
              <button className="reaction-btn" onClick={() => addReaction('sad')} title="Sad">
                😢 <span>{reactions.sad}</span>
              </button>
            </div>
          </div>

          {/* Edit/Delete Actions */}
          {(user?.role === "admin" || user?._id === post.author?._id) && (
            <div className="post-page-actions">
              <button onClick={handleEditPost} className="post-edit-btn">✏️ Edit</button>

              {(user?.role === "admin" || user?._id === post.author?._id) && (
                <button onClick={handleDeletePost} className="post-delete-btn">
                  🗑️ Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="post-comments-section">
          <h2 className="post-comments-header">💬 Comments</h2>
          
          {user ? (
            <div className="post-comment-form-container">
              <CommentForm postId={id} addComment={addComment} />
            </div>
          ) : (
            <div className="login-prompt">
              🔐 Login to add a comment.
            </div>
          )}
          
          <div className="post-comment-list">
            <CommentList comments={comments} onDelete={deleteComment} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;

