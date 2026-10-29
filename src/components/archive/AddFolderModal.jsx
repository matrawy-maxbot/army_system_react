/**
 * AddFolderModal Component
 * نافذة إضافة مجلد جديد
 */

import { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const AddFolderModal = ({ isOpen, onClose, categoryId }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryId) {
      setSelectedCategoryId(categoryId);
    }
  }, [categoryId]);

  const handleSave = async () => {
    if (!folderName.trim()) {
      setError('الرجاء إدخال اسم المجلد');
      return;
    }

    if (!selectedCategoryId) {
      setError('الرجاء اختيار فئة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newFolder = {
        id: Date.now(),
        name: folderName.trim(),
        description: folderDescription.trim(),
        categoryId: selectedCategoryId,
        files: []
      };

      const updatedCategories = appState.archiveCategories.map(cat => {
        if (cat.id === selectedCategoryId) {
          return {
            ...cat,
            folders: [...(cat.folders || []), newFolder]
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
      console.error('Error adding folder:', err);
      setError('حدث خطأ أثناء إضافة المجلد');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFolderName('');
    setFolderDescription('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="إضافة مجلد جديد">
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <Input
          label="اسم المجلد"
          id="folder-name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="مثال: مستندات 2026"
          required
        />

        <div className="form-group" style={{ marginTop: '15px' }}>
          <label htmlFor="folder-description">وصف المجلد</label>
          <textarea
            id="folder-description"
            value={folderDescription}
            onChange={(e) => setFolderDescription(e.target.value)}
            placeholder="وصف اختياري للمجلد..."
            rows="3"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <div className="form-group" style={{ marginTop: '15px' }}>
          <label htmlFor="folder-category">الفئة التابع لها</label>
          <select
            id="folder-category"
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
            <option value="">اختر الفئة...</option>
            {appState.archiveCategories?.map(cat => (
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
            {loading ? 'جاري الحفظ...' : 'حفظ المجلد'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFolderModal;
