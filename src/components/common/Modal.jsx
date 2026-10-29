import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'normal',
  showCloseButton = true,
  closeOnOverlayClick = true,
  customHeader = null
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
      <div className={`modal-content ${size === 'small' ? 'modal-small' : ''} ${size === 'medium' ? 'modal-medium' : ''} ${size === 'large' ? 'modal-large' : ''}`}>
        {customHeader ? (
          <div className="modal-header">
            {customHeader}
          </div>
        ) : (
          <div className="modal-header">
            <h2>{title}</h2>
            {showCloseButton && (
              <button className="btn-close" onClick={onClose} aria-label="إغلاق">
                ✕
              </button>
            )}
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['normal', 'small', 'medium', 'large']),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  customHeader: PropTypes.node
};

export default Modal;
