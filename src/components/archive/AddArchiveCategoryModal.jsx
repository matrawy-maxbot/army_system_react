/**
 * AddArchiveCategoryModal Component
 * نافذة إضافة فئة أرشيف جديدة
 */

import { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const AddArchiveCategoryModal = ({ isOpen, onClose }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!categoryName.trim()) {
      setError('الرجاء إدخال اسم الفئة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newCategory = {
        id: Date.now(),
        name: categoryName.trim(),
        folders: []
      };

      setAppState({
        ...appState,
        archiveCategories: [...(appState.archiveCategories || []), newCategory]
      });

      await saveData();
      handleClose();
    } catch (err) {
      console.error('Error adding archive category:', err);
      setError('حدث خطأ أثناء إضافة الفئة');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCategoryName('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="إضافة فئة أرشيف جديدة">
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <Input
          label="اسم الفئة"
          id="archive-category-name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="مثال: المستندات الإدارية"
          required
        />

        {error && (
          <div className="error-message" style={{ marginTop: '10px', color: '#ef4444' }}>
            {error}
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ الفئة'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddArchiveCategoryModal;
