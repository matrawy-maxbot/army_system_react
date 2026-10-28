import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'normal',
  disabled = false,
  type = 'button',
  className = '',
  icon = null,
  loading = false
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${className} ${loading ? 'btn-loading' : ''}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="btn-spinner"></span>}
      {icon && <span className="btn-icon-wrapper">{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'action', 'file', 'icon', 'toolbar']),
  size: PropTypes.oneOf(['normal', 'small', 'large']),
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  icon: PropTypes.node,
  loading: PropTypes.bool
};

export default Button;
