import React from 'react';
import PropTypes from 'prop-types';
import './Textarea.css';

const Textarea = ({ 
  value,
  onChange,
  placeholder = '',
  label = '',
  error = '',
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  id,
  name,
  maxLength,
  ...props
}) => {
  const textareaId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={textareaId}>
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        name={name}
        maxLength={maxLength}
        className={error ? 'input-error' : ''}
        {...props}
      />
      <div className="textarea-footer">
        {maxLength && (
          <span className="char-count">
            {value?.length || 0} / {maxLength}
          </span>
        )}
        {error && <span className="error-message">{error}</span>}
      </div>
    </div>
  );
};

Textarea.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  maxLength: PropTypes.number
};

export default Textarea;
