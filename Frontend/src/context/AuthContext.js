// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import api, { setAuthToken as setApiAuthToken } from '../utils/api';
import { toast } from 'react-toastify';

// Create context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Axios base config
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Set or remove token in BOTH axios instances
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchUser();
    } else {
      setLoading(false); // Finish loading even without token
    }
  }, []);

  // Fetch user from backend
  const fetchUser = async () => {
    try {
      const res = await axios.get('/auth/user'); // Make sure this route is protected and returns user
      setUser(res.data);
    } catch (err) {
      console.error('🔒 Failed to fetch user:', err?.response?.data?.message || err.message);
      logout(); // cleanly handle failure
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setAuthToken(token);
    setUser(user);
  };

  // Register user
  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setAuthToken(token);
    setUser(user);
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    toast.success('👋 Logged out successfully');
    
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;







