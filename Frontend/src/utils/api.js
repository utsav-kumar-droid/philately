import axios from 'axios';

// Axios instance with base URL and credentials enabled
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // sends cookies with each request
});

// Set or remove token in API headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auto-load token from localStorage if it exists
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export default api;




