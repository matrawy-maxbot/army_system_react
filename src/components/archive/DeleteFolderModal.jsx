/**
 * DeleteFolderModal Component
 * نافذة تأكيد حذف مجلد
 */

import { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { electronAPI } from '../../services';
import Modal from '../common/Modal';
import Button from '../common/Button';

const DeleteFolderModal = ({ isOpen, onClose, folderId }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // العثور على المجلد
  const findFolder = () => {
    if (!appState.archiveCategories) return null;
    
    for (const category of appState.archiveCategories) {
      const folder = category.folders?.find(f => f.id === folderId);
      if (folder) return { folder, category };
    }
    return null;
  };

  const result = findFolder();
  const folder = result?.folder;
  const category = result?.category;

  const handleDelete = async () => {
    if (!folder || !category) {
      setError('المجلد غير موجود');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // حذف الملفات من المجلد (اختياري - حذف الملفات الفعلية من assets)
      if (folder.files && folder.files.length > 0) {
        for (const file of folder.files) {
          try {
            if (file.path || file.name) {
              await electronAPI.deleteFileFromAssets(file.path || file.name);
            }
          } catch (err) {
            console.warn('Could not delete file:', file.name, err);
          }
        }
      }

      // حذف المجلد من الفئة
      const updatedCategories = appState.archiveCategories.map(cat => {
        if (cat.id === category.id) {
          return {
            ...cat,
            folders: cat.folders?.filter(f => f.id !== folderId) || []
          };
        }
        return cat;
      });

      setAppState({
        ...appState,
        archiveCategories: updatedCategories
      });

      await saveData();
      handleClose();
    } catch (err) {
      console.error('Error deleting folder:', err);
      setError('حدث خطأ أثناء حذف المجلد');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!folder) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="تأكيد حذف المجلد">
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
          هل أنت متأكد من حذف المجلد "<strong>{folder.name}</strong>"؟
        </p>
        {folder.files && folder.files.length > 0 && (
          <p style={{ fontSize: '14px', color: '#92400e', textAlign: 'center', margin: 0 }}>
            يحتوي المجلد على {folder.files.length} ملف سيتم حذفها أيضاً
          </p>
        )}
        <p style={{ fontSize: '13px', color: '#b45309', textAlign: 'center', margin: 0 }}>
          ملاحظة: حذف المجلد سيؤدي إلى حذف جميع الملفات الموجودة فيه
        </p>
      </div>

      {error && (
        <div className="error-message" style={{ marginTop: '10px', color: '#ef4444' }}>
          {error}
        </div>
      )}

      <div className="modal-actions" style={{ marginTop: '20px' }}>
        <Button type="button" variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'جاري الحذف...' : 'حذف المجلد'}
        </Button>
        <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
          إلغاء
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteFolderModal;
