/**
 * FileDetailModal Component
 * نافذة عرض تفاصيل الملف - Minimal Enterprise UX
 */

import { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { electronAPI } from '../../services';
import './FileDetailModal.css';

const FileDetailModal = ({ file, onClose, onUpdate }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!file) return null;

  const handleOpenFile = async () => {
    try {
      await electronAPI.openDocument(file.path || file.name);
    } catch (err) {
      console.error('Error opening file:', err);
      alert('فشل في فتح الملف');
    }
  };

  const handlePinFile = async () => {
    const updatedCategories = appState.archiveCategories.map(cat => {
      if (cat.id === file.categoryId) {
        return {
          ...cat,
          folders: cat.folders.map(folder => {
            if (folder.id === file.folderId) {
              return {
                ...folder,
                files: folder.files.map(f => 
                  f.id === file.id ? { ...f, isPinned: !f.isPinned } : f
                )
              };
            }
            return folder;
          })
        };
      }
      return cat;
    });

    setAppState({
      ...appState,
      archiveCategories: updatedCategories
    });

    await saveData();
    
    if (onUpdate) {
      await onUpdate();
    }
  };

  const handleDeleteFile = async () => {
    const updatedCategories = appState.archiveCategories.map(cat => {
      if (cat.id === file.categoryId) {
        return {
          ...cat,
          folders: cat.folders.map(folder => {
            if (folder.id === file.folderId) {
              return {
                ...folder,
                files: folder.files.filter(f => f.id !== file.id)
              };
            }
            return folder;
          })
        };
      }
      return cat;
    });

    setAppState({
      ...appState,
      archiveCategories: updatedCategories
    });

    await saveData();
    setShowDeleteModal(false);
    
    if (onUpdate) {
      await onUpdate();
    }
    
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileExtension = (filename) => {
    if (!filename) return 'FILE';
    const ext = filename.split('.').pop();
    return ext ? ext.toUpperCase().slice(0, 5) : 'FILE';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير متوفر';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const extension = getFileExtension(file.originalFileName || file.name);
  const fileType = extension === 'PDF' ? 'مستند PDF' :
                   extension === 'DOCX' || extension === 'DOC' ? 'مستند Word' :
                   extension === 'XLSX' || extension === 'XLS' ? 'جدول Excel' :
                   extension === 'PPTX' || extension === 'PPT' ? 'عرض PowerPoint' :
                   extension === 'PNG' || extension === 'JPG' || extension === 'JPEG' ? 'صورة' :
                   'ملف';

  return (
    <>
      <div className="file-detail-backdrop" onClick={onClose}>
        <section 
          className="file-detail-dialog" 
          role="dialog" 
          aria-modal="true"
          aria-labelledby="file-detail-heading"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="file-detail-head">
            <h1 id="file-detail-heading">تفاصيل الملف</h1>
            <button 
              className="file-detail-close" 
              aria-label="إغلاق" 
              onClick={onClose}
            >
              ×
            </button>
          </header>

          <main className="file-detail-main">
            <div className="file-identity">
              <div className="file-mark">{extension}</div>
              <div className="file-identity-text">
                <div className="file-identity-filename">
                  {file.originalFileName || file.name}
                </div>
                <div className="file-identity-sub">
                  {fileType} <span aria-hidden="true">·</span> {formatFileSize(file.size)}
                </div>
              </div>
              <div className="file-actions-wrap">
                <button 
                  className="file-action-btn pin-btn" 
                  aria-label={file.isPinned ? 'إزالة التثبيت' : 'تثبيت في الشريط الجانبي'}
                  title={file.isPinned ? 'إزالة التثبيت' : 'تثبيت في الشريط الجانبي'}
                  onClick={handlePinFile}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {file.isPinned ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251" />
                        <path d="M9 15l-4.5 4.5" />
                        <path d="M14.5 4l5.5 5.5" />
                      </>
                    ) : (
                      <>
                        <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" />
                        <path d="M9 15l-4.5 4.5" />
                        <path d="M14.5 4l5.5 5.5" />
                      </>
                    )}
                  </svg>
                </button>
                <button 
                  className="file-action-btn delete-btn" 
                  aria-label="حذف الملف"
                  title="حذف الملف"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4h8v2m3 0-.9 14H5.9L5 6m4 4v6m6-6v6"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="file-summary" aria-label="معلومات الملف">
              <div className="file-meta">
                <div className="file-meta-label">المجلد</div>
                <div className="file-meta-value">{file.folderName || 'غير محدد'}</div>
              </div>
              <div className="file-meta">
                <div className="file-meta-label">الفئة</div>
                <div className="file-meta-value">{file.categoryName || 'غير محدد'}</div>
              </div>
              <div className="file-meta">
                <div className="file-meta-label">تاريخ الإضافة</div>
                <div className="file-meta-value">{formatDate(file.addedAt)}</div>
              </div>
            </div>

            <div className="file-location">
              <span className={`file-pin-dot ${file.isPinned ? 'active' : ''}`}></span>
              <span>الحالة:</span>
              <strong>
                {file.isPinned ? 'مثبت في الشريط الجانبي' : 'غير مثبت في الشريط الجانبي'}
              </strong>
            </div>
          </main>

          <footer className="file-detail-footer">
            <span className="file-hint">يتم حفظ التغييرات تلقائيًا</span>
            <button className="file-open-btn" onClick={handleOpenFile}>
              فتح الملف <span aria-hidden="true">↗</span>
            </button>
          </footer>

          {/* Delete Confirmation Overlay */}
          <div className={`file-confirm-overlay ${showDeleteModal ? 'show' : ''}`}>
            <div className="file-confirm-box">
              <h2>حذف هذا الملف؟</h2>
              <p>
                سيتم حذف <strong>{file.originalFileName || file.name}</strong>. 
                لا يمكن التراجع عن هذه العملية.
              </p>
              <div className="file-confirm-actions">
                <button 
                  className="file-confirm-cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  إلغاء
                </button>
                <button 
                  className="file-confirm-delete"
                  onClick={handleDeleteFile}
                >
                  حذف الملف
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FileDetailModal;
