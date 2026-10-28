import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import './FileInput.css';

const FileInput = ({ 
  value,
  onChange,
  label = '',
  error = '',
  disabled = false,
  required = false,
  accept = '',
  multiple = false,
  buttonText = 'اختر ملف',
  placeholder = 'لم يتم اختيار ملف',
  className = '',
  id,
  name,
  ...props
}) => {
  const fileInputRef = useRef(null);
  const inputId = id || name || `file-${Math.random().toString(36).substr(2, 9)}`;

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const getFileName = () => {
    if (!value) return placeholder;
    
    // If value is a File object
    if (value instanceof File) {
      return value.name;
    }
    
    // If value is FileList
    if (value instanceof FileList) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) return value[0].name;
      return `${value.length} ملفات محددة`;
    }
    
    // If value is an array of files
    if (Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) return value[0].name;
      return `${value.length} ملفات محددة`;
    }
    
    // If value is a string (file path)
    if (typeof value === 'string') {
      return value.split(/[\\/]/).pop() || placeholder;
    }
    
    return placeholder;
  };

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div className="file-input-wrapper">
        <input
          ref={fileInputRef}
          type="file"
          id={inputId}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          name={name}
          style={{ display: 'none' }}
          {...props}
        />
        <span className={`file-input-text ${!value ? 'file-input-placeholder' : ''}`}>
          {getFileName()}
        </span>
        <Button
          variant="file"
          onClick={handleButtonClick}
          disabled={disabled}
          type="button"
        >
          {buttonText}
        </Button>
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

FileInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.instanceOf(FileList),
    PropTypes.arrayOf(PropTypes.instanceOf(File)),
    PropTypes.string
  ]),
  onChange: PropTypes.func,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  buttonText: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string
};

export default FileInput;
