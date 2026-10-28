import React from 'react';
import PropTypes from 'prop-types';
import './ColorPicker.css';

const ColorPicker = ({ value, onChange, label = 'اللون', className = '' }) => {
  const presetColors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6',
    '#ec4899', '#f43f5e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#e11d48', '#dc2626'
  ];

  return (
    <div className={`color-picker-wrapper ${className}`}>
      {label && <label className="color-picker-label">{label}</label>}
      
      <div className="color-picker-container">
        {/* Native color input */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="color-picker-input"
        />
        
        {/* Color preview */}
        <div className="color-preview" style={{ backgroundColor: value }}></div>
        
        {/* Color value text */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="color-value-input"
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      {/* Preset colors */}
      <div className="color-presets">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-preset ${value === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string
};

export default ColorPicker;
