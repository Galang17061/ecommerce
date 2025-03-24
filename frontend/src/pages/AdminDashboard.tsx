import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingBag } from 'react-icons/fa';

const AdminDashboard = () => {
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
            <h1>Admin Dashboard</h1>
          </motion.div>
          <p className="welcome-text">Coming soon...</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 