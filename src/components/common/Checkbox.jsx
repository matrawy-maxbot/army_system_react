import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.css';

const Checkbox = ({ 
  checked,
  onChange,
  label = '',
  disabled = false,
  className = '',
  id,
  name,
  ...props
}) => {
  const checkboxId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`checkbox-wrapper ${className}`}>
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        name={name}
        className="checkbox-input"
        {...props}
      />
      <label htmlFor={checkboxId} className="checkbox-label">
        <span className="checkbox-box">
          {checked && (
            <svg className="checkbox-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          )}
        </span>
        {label && <span className="checkbox-text">{label}</span>}
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string
};

export default Checkbox;
