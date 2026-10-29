/**
 * EditCategoryModal Component
 * نافذة تعديل فئة موجودة
 */

import { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';

const EditCategoryModal = ({ isOpen, onClose, categoryId }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');

  const currentCategory = appState.categories.find((c) => c.id === categoryId);

  useEffect(() => {
    if (currentCategory) {
      setCategoryName(currentCategory.name || '');
      setCategoryIcon(currentCategory.icon || '');
    }
  }, [currentCategory]);

  const handleSave = async () => {
    if (!categoryName.trim()) {
      alert('الرجاء إدخال اسم الفئة');
      return;
    }

    const updatedCategories = appState.categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          name: categoryName.trim(),
          icon: categoryIcon.trim() || '<svg class="svg-icon-md" style="display:inline-block;" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" /></svg>'
        };
      }
      return cat;
    });

    setAppState({
      ...appState,
      categories: updatedCategories
    });

    await saveData();
    handleClose();
  };

  const handleDelete = async () => {
    if (appState.categories.length === 1) {
      alert('لا يمكن حذف الفئة الأخيرة. يجب أن تبقى فئة واحدة على الأقل.');
      return;
    }

    const hasDocuments = currentCategory?.documents && currentCategory.documents.length > 0;

    if (hasDocuments) {
      const confirmMsg = `تحتوي هذه الفئة على ${currentCategory.documents.length} مستند. هل تريد حذفها مع جميع المستندات؟`;
      if (!window.confirm(confirmMsg)) return;
    } else {
      if (!window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;
    }

    // Delete all documents in category
    // Note: deleteFileFromAssets is not wrapped yet - keeping original implementation
    if (hasDocuments) {
      for (const doc of currentCategory.documents) {
        if (doc.file && window.electronAPI) {
          await window.electronAPI.deleteFileFromAssets(doc.file);
        }
        if (doc.icon && doc.icon.includes('_') && window.electronAPI) {
          await window.electronAPI.deleteFileFromAssets(doc.icon);
        }
      }
    }

    const updatedCategories = appState.categories.filter((c) => c.id !== categoryId);

    setAppState({
      ...appState,
      categories: updatedCategories
    });

    await saveData();
    handleClose();
  };

  const handleClose = () => {
    setCategoryName('');
    setCategoryIcon('');
    onClose();
  };

  if (!isOpen || !currentCategory) return null;

  return (
    <div className="modal active" onClick={(e) => e.target.classList.contains('modal') && handleClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>تعديل الفئة</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
            </svg>
          </button>
        </div>
        <form id="editCategoryForm" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="editCategoryName">اسم الفئة:</label>
              <input
                type="text"
                id="editCategoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="أدخل اسم الفئة"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="editCategoryIcon">الأيقونة (SVG أو نص):</label>
              <textarea
                id="editCategoryIcon"
                value={categoryIcon}
                onChange={(e) => setCategoryIcon(e.target.value)}
                placeholder="الصق كود SVG أو أدخل إيموجي..."
                rows="3"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-danger" onClick={handleDelete}>
              حذف الفئة
            </button>
            <div style={{ marginRight: 'auto', display: 'flex', gap: '8px' }}>
              <button type="button" className="btn-secondary" onClick={handleClose}>
                إلغاء
              </button>
              <button type="submit" className="btn-primary">
                حفظ التغييرات
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
