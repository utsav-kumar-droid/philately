// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await api.get('/posts');
        const allPosts = Array.isArray(res.data)
          ? res.data
          : res.data.posts && Array.isArray(res.data.posts)
          ? res.data.posts
          : [];

        const userAuthorId = user._id || user.id || user.emailId || user.email;
        const filtered = allPosts.filter((post) => {
          const authorId = post.author?._id || post.author;
          return String(authorId) === String(userAuthorId);
        });

        setPosts(filtered);
      } catch (err) {
        console.error('Failed to load user posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  if (!user) return <p>Loading your profile...</p>;

  return (
    <div className="profile-container" style={styles.container}>
      <h2 style={styles.heading}>👤 Your Profile</h2>

      {user.avatar && (
        <img src={user.avatar} alt="User Avatar" style={styles.avatar} />
      )}

      <div style={styles.infoBox}>
        {user.firstName && (
          <p><strong>First Name:</strong> {user.firstName}</p>
        )}
        {user.lastName && (
          <p><strong>Last Name:</strong> {user.lastName}</p>
        )}
        {user.username && (
          <p><strong>Username:</strong> {user.username}</p>
        )}
        {user.email && (
          <p><strong>Email:</strong> {user.email}</p>
        )}
        {user.age && (
          <p><strong>Age:</strong> {user.age}</p>
        )}
        {user.createdAt && (
          <p>
            <strong>Joined On:</strong>{' '}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div style={styles.postsSection}>
        <h3 style={styles.sectionHeading}>📝 Your Blogs</h3>
        {loadingPosts ? (
          <p style={styles.loadingText}>Loading your posts...</p>
        ) : posts.length === 0 ? (
          <p style={styles.emptyText}>You have not created any blogs yet.</p>
        ) : (
          <div style={styles.postsList}>
            {posts.map((post) => (
              <div key={post._id || post.id} style={styles.postCard}>
                <div>
                  <h4 style={styles.postTitle}>{post.title || 'Untitled Post'}</h4>
                  <p style={styles.postDate}>
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
                  </p>
                  <p style={styles.postExcerpt}>{(post.content || '').slice(0, 110)}{(post.content || '').length > 110 ? '...' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 0 18px rgba(0,0,0,0.08)',
    background: '#fff',
  },
  heading: {
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#1f2937',
  },
  avatar: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '50%',
    display: 'block',
    margin: '0 auto 1rem',
  },
  infoBox: {
    fontSize: '16px',
    lineHeight: '1.75',
    color: '#444',
    marginBottom: '2rem',
  },
  postsSection: {
    marginTop: '1.5rem',
  },
  sectionHeading: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    color: '#111827',
  },
  loadingText: {
    color: '#6b7280',
  },
  emptyText: {
    color: '#6b7280',
  },
  postsList: {
    display: 'grid',
    gap: '1rem',
  },
  postCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1rem',
    background: '#f8fafc',
  },
  postTitle: {
    fontSize: '1rem',
    margin: '0 0 0.35rem',
    color: '#111827',
  },
  postDate: {
    margin: '0 0 0.75rem',
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  postExcerpt: {
    margin: 0,
    color: '#374151',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
};

export default ProfilePage;

