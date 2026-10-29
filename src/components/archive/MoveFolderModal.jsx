/**
 * MoveFolderModal Component
 * نافذة نقل مجلد إلى فئة أخرى
 */

import { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Modal from '../common/Modal';
import Button from '../common/Button';

const MoveFolderModal = ({ isOpen, onClose, folderId }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // العثور على المجلد والفئة الحالية
  const findFolderAndCategory = () => {
    if (!appState.archiveCategories) return { folder: null, currentCategory: null };
    
    for (const category of appState.archiveCategories) {
      const folder = category.folders?.find(f => f.id === folderId);
      if (folder) {
        return { folder, currentCategory: category };
      }
    }
    return { folder: null, currentCategory: null };
  };

  const { folder, currentCategory } = findFolderAndCategory();

  // الفئات المتاحة للنقل (باستثناء الفئة الحالية)
  const availableCategories = appState.archiveCategories?.filter(
    cat => cat.id !== currentCategory?.id
  ) || [];

  useEffect(() => {
    if (availableCategories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(availableCategories[0].id);
    }
  }, [availableCategories, selectedCategoryId]);

  const handleMove = async () => {
    if (!selectedCategoryId) {
      setError('الرجاء اختيار فئة');
      return;
    }

    if (!folder || !currentCategory) {
      setError('المجلد غير موجود');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedCategories = appState.archiveCategories.map(cat => {
        // إزالة المجلد من الفئة القديمة
        if (cat.id === currentCategory.id) {
          return {
            ...cat,
            folders: cat.folders?.filter(f => f.id !== folderId) || []
          };
        }
        
        // إضافة المجلد للفئة الجديدة
        if (cat.id === selectedCategoryId) {
          return {
            ...cat,
            folders: [
              ...(cat.folders || []),
              { ...folder, categoryId: selectedCategoryId }
            ]
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
      console.error('Error moving folder:', err);
      setError('حدث خطأ أثناء نقل المجلد');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCategoryId(null);
    setError('');
    onClose();
  };

  if (!folder || !currentCategory) return null;

  if (availableCategories.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="نقل المجلد">
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
          لا توجد فئات أخرى متاحة لنقل المجلد إليها.
        </div>
        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            إغلاق
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="نقل المجلد إلى فئة أخرى">
      <form onSubmit={(e) => { e.preventDefault(); handleMove(); }}>
        <div className="form-group">
          <label htmlFor="current-category">الفئة الحالية</label>
          <input
            id="current-category"
            type="text"
            value={currentCategory.name}
            readOnly
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#f8f9fb',
              color: '#64748b'
            }}
          />
        </div>

        <div className="form-group" style={{ marginTop: '15px' }}>
          <label htmlFor="target-category">الفئة الجديدة</label>
          <select
            id="target-category"
            value={selectedCategoryId || ''}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            {availableCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="error-message" style={{ marginTop: '10px', color: '#ef4444' }}>
            {error}
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'جاري النقل...' : 'نقل المجلد'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MoveFolderModal;
