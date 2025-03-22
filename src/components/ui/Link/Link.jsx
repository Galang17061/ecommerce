import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './Link.css';

const Link = ({ 
  children,
  to,
  variant = 'primary',
  ...props 
}) => {
  return (
    <RouterLink
      to={to}
      className={`custom-link ${variant}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export default Link; 