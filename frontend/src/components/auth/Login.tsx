import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaUser, FaLock } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement login logic
      console.log('Login attempt:', formData);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <div className="logo-container">
            <FaShoppingBag className="logo-icon" />
            <h1>E-Shop</h1>
          </div>
          <p className="welcome-text">Welcome back! Please login to your account.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password" className="auth-link">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="social-login">
            <p>Or login with</p>
            <div className="social-buttons">
              <button type="button" className="social-button google">
                Google
              </button>
              <button type="button" className="social-button facebook">
                Facebook
              </button>
            </div>
          </div>

          <div className="auth-link">
            Don't have an account? <a href="/register">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 