import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

const DatePicker = ({ 
  value,
  onChange,
  label = 'التاريخ',
  error = '',
  disabled = false,
  required = false,
  min,
  max,
  className = '',
  ...props
}) => {
  return (
    <Input
      type="date"
      value={value}
      onChange={onChange}
      label={label}
      error={error}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      className={className}
      {...props}
    />
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
  className: PropTypes.string
};

export default DatePicker;
