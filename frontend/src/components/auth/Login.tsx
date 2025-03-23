import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingBag, FaUser, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import './Auth.css';

interface LoginResponse {
  token: string;
  user?: {
    id: number;
    email: string;
    username: string;
  };
  message?: string;
  error?: string;
}

interface VerifyResponse {
  valid: boolean;
  message?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with backend
          const { data } = await axios.get<VerifyResponse>('http://localhost:8080/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (data.valid) {
            navigate(from);
            return;
          }
        } catch (err) {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, [navigate, from]);

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
      const { data } = await axios.post<LoginResponse>('http://localhost:8080/api/auth/login', formData);
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      
      // Store user data if returned from backend
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Configure axios defaults for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      console.log('Login successful:', data);
      navigate(from);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="auth-container">
        <motion.div 
          className="auth-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="auth-header">
            <h2>Checking authentication...</h2>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <motion.div 
            className="logo-container"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaShoppingBag className="logo-icon" />
            <h1>E-Shop</h1>
          </motion.div>
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

          <motion.button
            type="submit"
            disabled={loading}
            className="auth-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>

          <div className="social-login">
            <p>Or login with</p>
            <div className="social-buttons">
              <motion.button 
                type="button" 
                className="social-button google"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Google
              </motion.button>
              <motion.button 
                type="button" 
                className="social-button facebook"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Facebook
              </motion.button>
            </div>
          </div>

          <div className="auth-link">
            Don't have an account? <a href="/register">Register</a>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login; 