import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    age: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setError('');
    setLoading(true);

    try {
      const { firstName, email, age, password } = formData;

      // Basic validation
      if (!firstName.trim() || !email.trim() || !password || !age) {
        throw new Error('All fields are required.');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum < 13) {
        throw new Error('Age must be a valid number (13 or above).');
      }

      const payload = {
        firstName: firstName.trim(),
        emailId: email.trim().toLowerCase(),//
        age: ageNum,
        password,
      };

      // Call AuthContext register
      await register(payload);

      toast.success('🎉 Registered successfully!');
      navigate('/dashboard');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.request ? '⚠️ Server not responding. Please try again later.' : err?.message) ||
        'Registration failed. Please try again.';

      console.error('❌ Registration Error:', message);
      toast.error(`❌ ${message}`);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Back to home */}
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
        <h2 className="login-title">Register</h2>

        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="login-input"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="login-input"
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            min="13"
            className="login-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="login-input"
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="login-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;








