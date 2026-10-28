import React from 'react';
import PropTypes from 'prop-types';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'normal', color = 'primary', className = '' }) => {
  return (
    <div className={`spinner-wrapper spinner-${size} ${className}`}>
      <div className={`spinner spinner-${color}`}></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'normal', 'large']),
  color: PropTypes.oneOf(['primary', 'white', 'success', 'danger']),
  className: PropTypes.string
};

export default LoadingSpinner;
