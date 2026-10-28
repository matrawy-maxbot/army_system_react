import React from 'react';
import PropTypes from 'prop-types';
import './Radio.css';

const Radio = ({ 
  checked,
  onChange,
  label = '',
  value,
  name,
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const radioId = id || `radio-${name}-${value}`;
  
  return (
    <div className={`radio-wrapper ${className}`}>
      <input
        type="radio"
        id={radioId}
        checked={checked}
        onChange={onChange}
        value={value}
        name={name}
        disabled={disabled}
        className="radio-input"
        {...props}
      />
      <label htmlFor={radioId} className="radio-label">
        <span className="radio-circle">
          {checked && <span className="radio-dot"></span>}
        </span>
        {label && <span className="radio-text">{label}</span>}
      </label>
    </div>
  );
};

Radio.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string
};

export default Radio;
