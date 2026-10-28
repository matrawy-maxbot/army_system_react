import React from 'react';
import ConfirmDialog from '../common/ConfirmDialog';

const DeleteDocumentConfirm = ({ isOpen, onClose, onConfirm, documentName }) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="تأكيد الحذف"
      message={`هل أنت متأكد من حذف المستند "${documentName}"؟ سيتم حذف جميع النسخ المرتبطة به.`}
      confirmText="حذف"
      cancelText="إلغاء"
      variant="danger"
    />
  );
};

export default DeleteDocumentConfirm;
