import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { electronAPI } from '../../services';
import { useSettings } from '../../context/SettingsContext';
import './DocumentDetailModal.css';

const DocumentDetailModal = ({ isOpen, onClose, document, categoryId, selectedDate, onUpdate }) => {
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    if (document && isOpen) {
      setCopies(document.copies || []);
    }
  }, [document, isOpen]);

  const handleAddCopy = async () => {
    if (!document) return;

    setLoading(true);

    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('ar-SA');
      const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

      // نسخ الملف الأصلي إلى نسخة جديدة مع الترقيم التسلسلي
      const result = await electronAPI.createDocumentCopy(
        categoryId,
        document.id,
        {
          savePath: settings.savePath,
          dateFormat: settings.dateFormat,
          customPattern: settings.customPattern,
          targetDate: selectedDate ? selectedDate.toISOString() : null
        }
      );

      if (result.success) {
        const newCopy = {
          title: result.fileName.replace(/\.\w+$/, ''),
          date: `${dateStr} ${timeStr}`,
          fileName: result.fileName,
          filePath: result.filePath,
          dateFolder: result.dateFolder
        };

        const updatedCopies = [...copies, newCopy];
        setCopies(updatedCopies);

        // تحديث المستند في الحالة الرئيسية
        if (onUpdate) {
          await onUpdate({
            ...document,
            copies: updatedCopies
          });
        }

        alert('تم إنشاء النسخة بنجاح!');
      } else {
        alert('فشل في إنشاء النسخة: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating copy:', error);
      alert('حدث خطأ أثناء إنشاء النسخة');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCopy = async (copy) => {
    try {
      await electronAPI.openFile(copy.filePath);
    } catch (error) {
      console.error('Error opening copy:', error);
      alert('حدث خطأ أثناء فتح النسخة');
    }
  };

  const handlePrintCopy = async (copy) => {
    try {
      const result = await electronAPI.printFile(copy.filePath);
      if (!result.success) {
        alert('فشل في الطباعة: ' + result.error);
      }
    } catch (error) {
      console.error('Error printing copy:', error);
      alert('حدث خطأ أثناء الطباعة');
    }
  };

  const handleDeleteCopy = async (index) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه النسخة؟')) {
      return;
    }

    try {
      const copy = copies[index];
      
      // حذف الملف
      await electronAPI.deleteFile(copy.filePath);

      const updatedCopies = copies.filter((_, i) => i !== index);
      setCopies(updatedCopies);

      // تحديث المستند في الحالة الرئيسية
      if (onUpdate) {
        await onUpdate({
          ...document,
          copies: updatedCopies
        });
      }

      alert('تم حذف النسخة بنجاح!');
    } catch (error) {
      console.error('Error deleting copy:', error);
      alert('حدث خطأ أثناء حذف النسخة');
    }
  };

  const handleOpenCopiesFolder = async () => {
    try {
      await electronAPI.openCopiesFolder(categoryId, document.id);
    } catch (error) {
      console.error('Error opening copies folder:', error);
      alert('حدث خطأ أثناء فتح مجلد النسخ');
    }
  };

  const renderIcon = () => {
    if (!document) return null;

    if (document.icon && document.icon.includes('_')) {
      const iconUrl = `asset://${encodeURIComponent(document.icon)}`;
      return (
        <img 
          src={iconUrl} 
          style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }} 
          alt={document.name}
        />
      );
    } else {
      return (
        <div 
          className="document-icon-large" 
          dangerouslySetInnerHTML={{ 
            __html: document.icon || `
              <svg class="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
              </svg>
            `
          }}
        />
      );
    }
  };

  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تفاصيل المستند"
      size="normal"
    >
      <div className="document-detail-container">
        <div className="document-info-header">
          {renderIcon()}
          <div className="document-info-text">
            <h3>{document.name}</h3>
            <p>{document.originalFileName || document.file}</p>
          </div>
        </div>

        <div className="document-actions-bar">
          <Button
            variant="primary"
            onClick={handleAddCopy}
            disabled={loading}
          >
            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1" />
            </svg>
            إنشاء نسخة جديدة
          </Button>
          <Button
            variant="secondary"
            onClick={handleOpenCopiesFolder}
          >
            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
            </svg>
            فتح مجلد النسخ
          </Button>
        </div>

        <div className="copies-list-container">
          <h4>النسخ ({copies.length})</h4>
          {copies.length === 0 ? (
            <div className="no-copies-message">
              <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
              </svg>
              <p>لا توجد نسخ حالياً</p>
            </div>
          ) : (
            <div className="copies-list">
              {copies.map((copy, index) => (
                <div key={index} className="copy-item">
                  <div className="copy-number">{index + 1}</div>
                  <div className="copy-info">
                    <div className="copy-title">{copy.title}</div>
                    <div className="copy-date">{copy.date}</div>
                  </div>
                  <div className="copy-status">
                    <div className="copy-status-dot"></div>
                  </div>
                  <div className="copy-actions">
                    <button 
                      className="btn-action btn-small" 
                      onClick={() => handleOpenCopy(copy)}
                      title="فتح"
                    >
                      فتح ←
                    </button>
                    <button 
                      className="btn-success btn-small" 
                      onClick={() => handlePrintCopy(copy)}
                      title="طباعة"
                    >
                      <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                        <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                        <path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4" />
                      </svg>
                    </button>
                    <button 
                      className="btn-delete btn-small" 
                      onClick={() => handleDeleteCopy(index)}
                      title="حذف"
                    >
                      <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1" />
                        <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DocumentDetailModal;
