import React from 'react';
import './TextField.css';

const TextField = ({ 
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="input-group">
      {Icon && <Icon className="input-icon" />}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`text-field ${Icon ? 'with-icon' : ''}`}
        {...props}
      />
    </div>
  );
};

export default TextField; 