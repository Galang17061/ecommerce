import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ 
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  fullWidth = false,
  ...props 
}) => {
  return (
    <motion.button
      type={type}
      className={`button ${variant} ${fullWidth ? 'full-width' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button; 