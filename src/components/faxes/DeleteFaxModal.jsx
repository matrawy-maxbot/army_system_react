/**
 * DeleteFaxModal Component
 * نافذة تأكيد حذف الفاكس الأصلي
 */

import { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { electronAPI } from '../../services';
import Modal from '../common/Modal';
import Button from '../common/Button';

const DeleteFaxModal = ({ isOpen, onClose }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const originalFax = appState.originalFax;

  const handleDelete = async () => {
    if (!originalFax) {
      setError('الفاكس غير موجود');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // حذف ملف الفاكس الأصلي من assets (إذا كان موجوداً)
      if (originalFax.filePath && originalFax.filePath !== 'mock://merged-pdf') {
        try {
          await electronAPI.deleteFileFromAssets(originalFax.filePath);
        } catch (err) {
          console.warn('Could not delete fax file:', originalFax.fileName, err);
        }
      }

      // حذف صور الفاكس (في حالة كان من نوع images)
      if (originalFax.images && originalFax.images.length > 0) {
        for (const imagePath of originalFax.images) {
          try {
            await electronAPI.deleteFileFromAssets(imagePath);
          } catch (err) {
            console.warn('Could not delete image:', imagePath, err);
          }
        }
      }

      // حذف الفاكس الأصلي وكل الصفحات والفاكسات المرتبطة به
      const updatedState = {
        ...appState,
        originalFax: null,
        faxPages: [],
        faxes: [],
        currentFilteringSession: {
          isActive: false,
          nextFaxNumber: 1
        }
      };

      setAppState(updatedState);
      await saveData();
      handleClose();
    } catch (err) {
      console.error('Error deleting fax:', err);
      setError('حدث خطأ أثناء حذف الفاكس');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!originalFax) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="تأكيد حذف الفاكس الأصلي">
      <div className="warning-message" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        background: '#fef3c7',
        borderRadius: '8px',
        gap: '12px'
      }}>
        <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#f59e0b' }}>
          <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
        </svg>
        <p style={{ fontSize: '16px', color: '#92400e', textAlign: 'center', margin: 0 }}>
          هل أنت متأكد من حذف الفاكس الأصلي "<strong>{originalFax.fileName}</strong>"؟
        </p>
        <p style={{ fontSize: '14px', color: '#92400e', textAlign: 'center', margin: 0 }}>
          يحتوي الفاكس على {originalFax.pageCount} صفحة
        </p>
        <p style={{ fontSize: '13px', color: '#b45309', textAlign: 'center', margin: 0 }}>
          ملاحظة: حذف الفاكس الأصلي سيؤدي إلى حذف جميع الصفحات المفلترة والفاكسات المرتبطة به
        </p>
      </div>

      {error && (
        <div className="error-message" style={{ marginTop: '10px', color: '#ef4444' }}>
          {error}
        </div>
      )}

      <div className="modal-actions" style={{ marginTop: '20px' }}>
        <Button type="button" variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'جاري الحذف...' : 'حذف الفاكس'}
        </Button>
        <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
          إلغاء
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteFaxModal;
