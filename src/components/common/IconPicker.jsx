import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './IconPicker.css';

const IconPicker = ({ onSelect, onImageSelect, selectedIcon, selectedImage, label = 'اختر أيقونة' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Icons from the old project - TablerIcons SVG format
  const icons = [
    { name: 'مجلد', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" /></svg>' },
    { name: 'ملف', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/></svg>' },
    { name: 'إعدادات', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" /></svg>' },
    { name: 'رسالة', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 5a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883zm0 8a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z"/></svg>' },
    { name: 'بيت', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.707 2.293l9 9c.63 .63 .184 1.707 -.707 1.707h-1v6a3 3 0 0 1 -3 3h-1v-7a3 3 0 0 0 -2.824 -2.995l-.176 -.005h-2a3 3 0 0 0 -3 3v7h-1a3 3 0 0 1 -3 -3v-6h-1c-.89 0 -1.337 -1.077 -.707 -1.707l9 -9a1 1 0 0 1 1.414 0m.293 11.707a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883 -.993l.117 -.007z" /></svg>' },
    { name: 'تقويم', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1zm3 7h-14v9a1 1 0 0 0 .883 .993l.117 .007h14a1 1 0 0 0 .993 -.883l.007 -.117v-9z" /></svg>' },
    { name: 'كتاب', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.088 4.82a10 10 0 0 1 9.412 .314a1 1 0 0 1 .493 .748l.007 .118v13a1 1 0 0 1 -1.5 .866a8 8 0 0 0 -8 0a1 1 0 0 1 -1 0a8 8 0 0 0 -7.733 -.148l-.327 .18l-.103 .044l-.049 .016l-.11 .026l-.061 .01l-.117 .006h-.042l-.11 -.012l-.077 -.014l-.108 -.032l-.126 -.056l-.095 -.056l-.089 -.067l-.06 -.056l-.073 -.082l-.064 -.089l-.022 -.036l-.032 -.06l-.044 -.103l-.016 -.049l-.026 -.11l-.01 -.061l-.004 -.049l-.002 -.068v-13a1 1 0 0 1 .5 -.866a10 10 0 0 1 9.412 -.314l.088 .044l.088 -.044z" /></svg>' },
    { name: 'نجمة', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" /></svg>' }
  ];

  const filteredIcons = icons.filter(icon => 
    icon.name.includes(searchTerm)
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  return (
    <div className="icon-picker-wrapper">
      <label className="icon-picker-label">{label}</label>
      
      {/* Search */}
      <input
        type="text"
        className="icon-picker-search"
        placeholder="ابحث عن أيقونة..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Selected preview */}
      {(selectedIcon || selectedImage) && (
        <div className="current-icon-preview">
          {selectedImage ? (
            <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: selectedIcon }} className="icon-preview-svg" />
          )}
        </div>
      )}

      {/* Icon Grid */}
      <div className="icon-picker-grid">
        {filteredIcons.map((icon, index) => (
          <div
            key={index}
            className={`icon-item ${selectedIcon === icon.svg ? 'selected' : ''}`}
            onClick={() => onSelect(icon.svg)}
            title={icon.name}
          >
            <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
          </div>
        ))}
      </div>

      {/* Upload Image */}
      <div className="icon-picker-upload">
        <input
          type="file"
          id="icon-image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="icon-image-upload" className="btn-upload-icon">
          أو ارفع صورة مخصصة
        </label>
      </div>
    </div>
  );
};

IconPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onImageSelect: PropTypes.func,
  selectedIcon: PropTypes.string,
  selectedImage: PropTypes.instanceOf(File),
  label: PropTypes.string
};

export default IconPicker;
