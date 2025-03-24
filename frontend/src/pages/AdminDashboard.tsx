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
          <p className="welcome-text">Manage your store with ease and efficiency</p>
        </div>
        <div className="mt-8">
          <motion.div
            className="bg-white shadow-lg rounded-lg p-6 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold mb-2">Sales Overview</h2>
            <p className="text-gray-600">Track your sales performance and growth.</p>
          </motion.div>
          <motion.div
            className="bg-white shadow-lg rounded-lg p-6"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold mb-2">Inventory Management</h2>
            <p className="text-gray-600">Keep your inventory up-to-date and organized.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 