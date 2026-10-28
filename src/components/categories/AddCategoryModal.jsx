/**
 * AddCategoryModal Component
 * نافذة إضافة فئة جديدة
 */

import { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';

const AddCategoryModal = ({ isOpen, onClose }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');

  const handleSave = async () => {
    if (!categoryName.trim()) {
      alert('الرجاء إدخال اسم الفئة');
      return;
    }

    const newCategory = {
      id: Date.now(),
      name: categoryName.trim(),
      icon: categoryIcon.trim() || '<svg class="svg-icon-md" style="display:inline-block;" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" /></svg>',
      documents: []
    };

    setAppState({
      ...appState,
      categories: [...appState.categories, newCategory]
    });

    await saveData();
    handleClose();
  };

  const handleClose = () => {
    setCategoryName('');
    setCategoryIcon('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={(e) => e.target.classList.contains('modal') && handleClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>إضافة فئة جديدة</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
            </svg>
          </button>
        </div>
        <form id="addCategoryForm" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="categoryName">اسم الفئة:</label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="أدخل اسم الفئة"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryIcon">الأيقونة (SVG أو نص):</label>
              <textarea
                id="categoryIcon"
                value={categoryIcon}
                onChange={(e) => setCategoryIcon(e.target.value)}
                placeholder="الصق كود SVG أو أدخل إيموجي..."
                rows="3"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              إلغاء
            </button>
            <button type="submit" className="btn-primary">
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
