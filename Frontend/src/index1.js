import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css'; 
// import './home/index2.css';

import App from './App'; // Main app
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';

// Root rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BlogProvider>
          <App/>
        </BlogProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
