/**
 * FolderViewModal Component
 * نافذة عرض محتويات المجلد
 */

import { useState, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { electronAPI } from '../../services';
import Modal from '../common/Modal';
import Button from '../common/Button';
import './FolderViewModal.css';

const FolderViewModal = ({ isOpen, onClose, folderId, onEdit, onMove, onDelete }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // العثور على المجلد
  const findFolder = () => {
    if (!appState.archiveCategories) return null;
    
    for (const category of appState.archiveCategories) {
      const folder = category.folders?.find(f => f.id === folderId);
      if (folder) {
        return { folder, category };
      }
    }
    return null;
  };

  const result = findFolder();
  const folder = result?.folder;
  const category = result?.category;

  const handleAddFiles = async () => {
    if (!folder) return;

    // استخدام fileAPI بدلاً من electronAPI مباشرة
    const result = await electronAPI.selectMultipleFiles({
      filters: [
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.success || result.canceled || !result.files?.length) {
      return;
    }

    setLoading(true);

    try {
      const newFiles = [];

      for (const fileInfo of result.files) {
        // نسخ الملف إلى مجلد assets
        const copyResult = await electronAPI.copyFileToAssets(
          fileInfo.filePath,
          folder.categoryId,
          Date.now()
        );

        if (copyResult.success) {
          newFiles.push({
            id: Date.now() + Math.random(),
            name: copyResult.fileName,
            originalFileName: fileInfo.fileName || copyResult.fileName,
            size: fileInfo.fileSize || copyResult.size || 0,
            addedAt: new Date().toISOString(),
            path: copyResult.fileName
          });
        }
      }

      if (newFiles.length > 0) {
        const updatedCategories = appState.archiveCategories.map(cat => {
          if (cat.id === folder.categoryId) {
            return {
              ...cat,
              folders: cat.folders.map(f => {
                if (f.id === folderId) {
                  return {
                    ...f,
                    files: [...(f.files || []), ...newFiles]
                  };
                }
                return f;
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
      }
    } catch (err) {
      console.error('Error adding files:', err);
      alert('حدث خطأ أثناء إضافة الملفات');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = async (file) => {
    try {
      await electronAPI.openDocument(file.path || file.name);
    } catch (err) {
      console.error('Error opening file:', err);
      alert('فشل في فتح الملف');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!folder || !category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={folder.name}
      size="large"
    >
      <div className="folder-view-content">
        <div className="folder-info">
          <div className="folder-info-item">
            <strong>الفئة:</strong>
            <span>{category.name}</span>
          </div>
          {folder.description && (
            <div className="folder-info-item">
              <strong>الوصف:</strong>
              <span>{folder.description}</span>
            </div>
          )}
        </div>

        <div className="folder-actions-bar">
          <Button variant="primary" onClick={handleAddFiles} disabled={loading}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
              <path d="M12 11l0 6"/>
              <path d="M9 14l6 0"/>
            </svg>
            إضافة ملفات
          </Button>
          <Button variant="secondary" onClick={() => onEdit(folderId)}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"/>
              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"/>
              <path d="M16 5l3 3"/>
            </svg>
            تعديل
          </Button>
          <Button variant="secondary" onClick={() => onMove(folderId)}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 4h3l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"/>
              <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h2"/>
            </svg>
            نقل
          </Button>
          <Button variant="danger" onClick={() => onDelete(folderId)}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1"/>
              <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z"/>
            </svg>
            حذف
          </Button>
        </div>

        <div className="folder-files-section">
          <h3>الملفات ({folder.files?.length || 0})</h3>
          
          {!folder.files || folder.files.length === 0 ? (
            <div className="folder-files-empty">
              <div className="empty-icon">
                <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                </svg>
              </div>
              <p>لا توجد ملفات في هذا المجلد</p>
              <p className="empty-hint">اضغط على "إضافة ملفات" لإضافة ملفات جديدة</p>
            </div>
          ) : (
            <div className="folder-files-grid">
              {folder.files.map(file => (
                <div 
                  key={file.id} 
                  className="folder-file-card"
                  onClick={() => handleOpenFile(file)}
                >
                  <div className="folder-file-icon">
                    <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                    </svg>
                  </div>
                  <div className="folder-file-name">{file.originalFileName || file.name}</div>
                  {file.size > 0 && (
                    <div className="folder-file-size">{formatFileSize(file.size)}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FolderViewModal;
