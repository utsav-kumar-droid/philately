// src/components/posts/PostList.js
import React from 'react';
import PostItem from './PostItem';
// import './PostList.css';

const PostList = ({ posts }) => {
  const hasPosts = Array.isArray(posts) && posts.length > 0;

  return (
    <div className="post-list-container">
      {hasPosts ? (
        posts.map((post) => <PostItem key={post._id} post={post} />)
      ) : (
        <div className="post-list-empty">
          <p>No posts available. Start writing and share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default PostList;

