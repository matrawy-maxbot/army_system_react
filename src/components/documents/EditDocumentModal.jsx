import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import IconPicker from '../common/IconPicker';
import { electronAPI } from '../../services';

const EditDocumentModal = ({ isOpen, onClose, document, categoryId, onSuccess, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    iconFile: null,
    docFile: null,
    docFileName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (document && isOpen) {
      setFormData({
        name: document.name || '',
        icon: document.icon || '',
        iconFile: null,
        docFile: null,
        docFileName: document.originalFileName || document.file || ''
      });
    }
  }, [document, isOpen]);

  const handleNameChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleIconSelect = (iconSvg) => {
    setFormData({ ...formData, icon: iconSvg });
  };

  const handleDocFileClick = async () => {
    const result = await electronAPI.selectFile({
      filters: [
        { name: 'Word Documents', extensions: ['doc', 'docx'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (result.success && !result.canceled) {
      setFormData({
        ...formData,
        docFile: result.filePath,
        docFileName: result.fileName
      });
    }
  };

  const handleIconFileClick = async () => {
    const result = await electronAPI.selectFile({
      filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'ico'] }
      ]
    });
    
    if (result.success && !result.canceled) {
      setFormData({
        ...formData,
        iconFile: result.filePath,
        icon: result.filePath
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('الرجاء إدخال اسم المستند');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedDoc = { ...document, name: formData.name };

      // إذا تم اختيار ملف جديد
      if (formData.docFile) {
        // حذف الملف القديم
        if (document.file) {
          await electronAPI.deleteFileFromAssets(document.file);
        }

        // نسخ الملف الجديد
        const docCopyResult = await electronAPI.copyFileToAssets(
          formData.docFile,
          categoryId,
          document.id
        );

        if (!docCopyResult.success) {
          setError('فشل في نسخ الملف: ' + docCopyResult.error);
          setLoading(false);
          return;
        }

        updatedDoc.file = docCopyResult.fileName;
        updatedDoc.originalFileName = formData.docFileName;
      }

      // إذا تم اختيار أيقونة جديدة (ملف)
      if (formData.iconFile) {
        // حذف الأيقونة القديمة إذا كانت ملف
        if (document.icon && document.icon.includes('_')) {
          await electronAPI.deleteFileFromAssets(document.icon);
        }

        const iconCopyResult = await electronAPI.copyFileToAssets(
          formData.iconFile,
          categoryId,
          document.id
        );

        if (iconCopyResult.success) {
          updatedDoc.icon = iconCopyResult.fileName;
        }
      } else {
        // إذا تم اختيار أيقونة SVG
        updatedDoc.icon = formData.icon;
      }

      if (onSuccess) {
        await onSuccess(updatedDoc);
      }

      onClose();
    } catch (error) {
      console.error('Error editing document:', error);
      setError('حدث خطأ أثناء تعديل المستند');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستند؟')) {
      return;
    }

    setLoading(true);

    try {
      // حذف الملف من assets
      if (document.file) {
        await electronAPI.deleteFileFromAssets(document.file);
      }
      
      // حذف الأيقونة إذا كانت موجودة
      if (document.icon && document.icon.includes('_')) {
        await electronAPI.deleteFileFromAssets(document.icon);
      }

      if (onDelete) {
        await onDelete(document.id);
      }

      onClose();
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('حدث خطأ أثناء حذف المستند');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      icon: '',
      iconFile: null,
      docFile: null,
      docFileName: ''
    });
    setError('');
    onClose();
  };

  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="تعديل المستند"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="اسم المستند"
          id="edit-document-name"
          name="editDocumentName"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="أدخل اسم المستند"
          required
        />

        <div className="form-group">
          <label htmlFor="current-file-info">الملف الحالي</label>
          <div className="current-file-info" id="current-file-info">
            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
            </svg>
            <span>{formData.docFileName}</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="edit-doc-file-selector">تغيير الملف (اختياري)</label>
          <div className="file-input-wrapper">
            <span className="file-input-text">
              {formData.docFile ? formData.docFileName : 'لم يتم اختيار ملف جديد'}
            </span>
            <Button
              id="edit-doc-file-selector"
              type="button"
              variant="file"
              onClick={handleDocFileClick}
            >
              اختر ملف جديد
            </Button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="edit-icon-picker">اختر أيقونة</label>
          <div id="edit-icon-picker">
            <IconPicker
              selectedIcon={formData.icon}
              onSelectIcon={handleIconSelect}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
              أو ارفع صورة مخصصة:
            </p>
            <div className="file-input-wrapper">
              <span className="file-input-text">
                {formData.iconFile ? formData.iconFile.split(/[\\/]/).pop() : 'لم يتم اختيار صورة'}
              </span>
              <Button
                id="edit-icon-file-selector"
                type="button"
                variant="file"
                onClick={handleIconFileClick}
              >
                اختر صورة
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <div className="modal-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
          >
            حذف المستند
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDocumentModal;
