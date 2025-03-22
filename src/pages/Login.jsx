import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaUser, FaLock } from 'react-icons/fa';
import { TextField, Button, Link } from '../components/ui';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
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

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <TextField
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              icon={FaUser}
            />
          </div>

          <div className="form-group">
            <TextField
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              icon={FaLock}
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Login
          </Button>

          <div className="social-login">
            <p>Or login with</p>
            <div className="social-buttons">
              <Button variant="google">
                Google
              </Button>
              <Button variant="facebook">
                Facebook
              </Button>
            </div>
          </div>

          <div className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login; 