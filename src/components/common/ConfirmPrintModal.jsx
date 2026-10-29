/**
 * ConfirmPrintModal Component
 * مودال تأكيد الطباعة
 */

import React from 'react';
import Modal from './Modal';
import Button from './Button';
import './ConfirmPrintModal.css';

const ConfirmPrintModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "تأكيد الطباعة",
  message,
  itemName,
  itemCount,
  pagesCount,
  loading = false 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="confirm-print-content">
        <div className="confirm-print-icon">
          <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"/>
            <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"/>
            <path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4"/>
          </svg>
        </div>

        <div className="confirm-print-message">
          {message && <p className="confirm-print-text">{message}</p>}
          
          {itemName && (
            <p className="confirm-print-item">
              <strong>{itemName}</strong>
            </p>
          )}
          
          <div className="confirm-print-details">
            {itemCount && (
              <div className="confirm-print-detail">
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z"/>
                </svg>
                <span>{itemCount}</span>
              </div>
            )}
            
            {pagesCount && (
              <div className="confirm-print-detail">
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                </svg>
                <span>{pagesCount}</span>
              </div>
            )}
          </div>

          <p className="confirm-print-note">
            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
            </svg>
            تأكد من توصيل الطابعة قبل الطباعة
          </p>
        </div>
      </div>

      <div className="modal-actions">
        <Button variant="primary" onClick={onConfirm} disabled={loading}>
          <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"/>
            <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"/>
            <path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4"/>
          </svg>
          {loading ? 'جاري الطباعة...' : 'تأكيد الطباعة'}
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmPrintModal;
