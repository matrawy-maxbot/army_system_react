import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useModalZIndex } from '../../context/ModalStackContext';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'normal',
  showCloseButton = true,
  closeOnOverlayClick = true,
  customHeader = null,
  modalId
}) => {
  // إنشاء modalId ثابت إذا لم يتم توفيره
  const stableModalId = useRef(modalId || `modal-${Math.random().toString(36).substr(2, 9)}`);
  
  // الحصول على z-index من النظام
  const zIndex = useModalZIndex(stableModalId.current, isOpen);
  const modalRef = useRef(null);

  // تطبيق z-index مع !important
  useEffect(() => {
    if (modalRef.current && isOpen) {
      modalRef.current.style.cssText = `z-index: ${zIndex} !important`;
    }
  }, [zIndex, isOpen]);

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
    // منع انتشار الحدث للمودالات الأخرى
    e.stopPropagation();
    
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      ref={modalRef}
      className={`modal ${isOpen ? 'active' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div 
        className={`modal-content ${size === 'small' ? 'modal-small' : ''} ${size === 'medium' ? 'modal-medium' : ''} ${size === 'large' ? 'modal-large' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
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
  customHeader: PropTypes.node,
  modalId: PropTypes.string
};

export default Modal;
