import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import IconPicker from '../common/IconPicker';
import { electronAPI } from '../../services';

const AddDocumentModal = ({ isOpen, onClose, categoryId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    iconFile: null,
    docFile: null,
    docFileName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const docFileInputRef = useRef(null);
  const iconFileInputRef = useRef(null);

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
        icon: result.filePath  // سيتم استبداله بالمسار النسبي بعد النسخ
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.docFile) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // نسخ الملف الأصلي إلى مجلد assets
      const docCopyResult = await electronAPI.copyFileToAssets(
        formData.docFile,
        categoryId,
        Date.now()
      );

      if (!docCopyResult.success) {
        setError('فشل في نسخ الملف: ' + docCopyResult.error);
        setLoading(false);
        return;
      }

      let savedIconFileName = null;

      // نسخ الأيقونة إذا تم تحديدها
      if (formData.iconFile) {
        const iconCopyResult = await electronAPI.copyFileToAssets(
          formData.iconFile,
          categoryId,
          Date.now()
        );
        if (iconCopyResult.success) {
          savedIconFileName = iconCopyResult.fileName;
        }
      }

      const newDoc = {
        id: Date.now(),
        name: formData.name,
        icon: savedIconFileName || formData.icon || '<svg class="svg-icon-xl" style="display:inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/></svg>',
        file: docCopyResult.fileName,
        originalFileName: formData.docFileName,
        copies: []
      };

      if (onSuccess) {
        await onSuccess(newDoc);
      }

      // إعادة تعيين النموذج
      setFormData({
        name: '',
        icon: '',
        iconFile: null,
        docFile: null,
        docFileName: ''
      });

      onClose();
    } catch (error) {
      console.error('Error adding document:', error);
      setError('حدث خطأ أثناء إضافة المستند');
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="إضافة مستند جديد"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="اسم المستند"
          id="document-name"
          name="documentName"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="أدخل اسم المستند"
          required
        />

        <div className="form-group">
          <label htmlFor="doc-file-selector">اختر ملف المستند <span className="required-mark">*</span></label>
          <div className="file-input-wrapper">
            <span className="file-input-text">
              {formData.docFileName || 'لم يتم اختيار ملف'}
            </span>
            <Button
              id="doc-file-selector"
              type="button"
              variant="file"
              onClick={handleDocFileClick}
            >
              اختر ملف
            </Button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="icon-picker">اختر أيقونة</label>
          <div id="icon-picker">
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
                id="icon-file-selector"
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
            {loading ? 'جاري الحفظ...' : 'حفظ'}
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

export default AddDocumentModal;
