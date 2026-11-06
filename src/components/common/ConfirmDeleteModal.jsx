/**
 * ConfirmDeleteModal Component
 * مودال تأكيد الحذف قابل لإعادة الاستخدام
 */

import React from 'react';
import Modal from './Modal';
import Button from './Button';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "تأكيد الحذف",
  message,
  itemName,
  itemCount,
  warningNote,
  loading = false,
  modalId = 'confirm-delete-modal'
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title} 
      size="small"
      modalId={modalId}
    >
      <div className="confirm-delete-content">
        <div className="confirm-delete-icon">
          <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
          </svg>
        </div>

        <div className="confirm-delete-message">
          {message && <p className="confirm-delete-text">{message}</p>}
          
          {itemName && (
            <p className="confirm-delete-item">
              <strong>{itemName}</strong>
            </p>
          )}
          
          {itemCount && (
            <p className="confirm-delete-count">
              {itemCount}
            </p>
          )}
          
          {warningNote && (
            <p className="confirm-delete-warning">
              <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
              </svg>
              {warningNote}
            </p>
          )}
        </div>
      </div>

      <div className="modal-actions">
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1"/>
            <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z"/>
          </svg>
          {loading ? 'جاري الحذف...' : 'تأكيد الحذف'}
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
