import React, { createContext, useContext, useState } from 'react';

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  return (
    <BlogContext.Provider value={{ posts, setPosts }}>
      {children}
    </BlogContext.Provider>
  );
};
