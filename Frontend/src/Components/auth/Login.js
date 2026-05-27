import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple clicks

    setError('');
    setLoading(true);

    try {
      const email = formData.email.trim();
      const password = formData.password;

      // Validation
      if (!email || !password) {
        setError('Both email and password are required.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }

      // ✅ Update: send emailId to match backend
await login({ emailId: email, password });
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.';

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <button
        className="back-button"
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          color: '#333',
          fontSize: '15px',
          marginBottom: '20px',
          cursor: 'pointer',
        }}
      >
        ← Back to Home
      </button>

      <div className="login-card">
        <h2 className="login-title">Login</h2>

        {/* Error message */}
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="login-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="login-input"
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;






