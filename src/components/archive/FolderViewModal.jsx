/**
 * FolderViewModal Component
 * نافذة عرض محتويات المجلد - Enterprise Minimal Design
 */

import { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { electronAPI } from '../../services';
import './FolderViewModal.css';

const FolderViewModal = ({ isOpen, onClose, folderId, onEdit, onMove, onDelete }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

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

  const handlePinFolder = async () => {
    if (!folder) return;

    const updatedCategories = appState.archiveCategories.map(cat => {
      if (cat.id === folder.categoryId) {
        return {
          ...cat,
          folders: cat.folders.map(f => 
            f.id === folderId ? { ...f, isPinned: !f.isPinned } : f
          )
        };
      }
      return cat;
    });

    setAppState({
      ...appState,
      archiveCategories: updatedCategories
    });

    await saveData();
  };

  const handleOpenFile = async (file) => {
    try {
      await electronAPI.openDocument(file.path || file.name);
    } catch (err) {
      console.error('Error opening file:', err);
      alert('فشل في فتح الملف');
    }
  };

  const handleToggleFileSelection = (fileId) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleClearSelection = () => {
    setSelectedFiles(new Set());
  };

  const handleDeleteSelected = async () => {
    if (!folder || selectedFiles.size === 0) return;

    if (!window.confirm(`هل تريد حذف ${selectedFiles.size} ملف؟`)) {
      return;
    }

    const updatedCategories = appState.archiveCategories.map(cat => {
      if (cat.id === folder.categoryId) {
        return {
          ...cat,
          folders: cat.folders.map(f => {
            if (f.id === folderId) {
              return {
                ...f,
                files: f.files.filter(file => !selectedFiles.has(file.id))
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
    setSelectedFiles(new Set());
  };

  const handleDeleteFile = (file) => {
    setFileToDelete(file);
    setShowDeleteFileModal(true);
  };

  const confirmDeleteFile = async () => {
    if (!folder || !fileToDelete) return;

    const updatedCategories = appState.archiveCategories.map(cat => {
      if (cat.id === folder.categoryId) {
        return {
          ...cat,
          folders: cat.folders.map(f => {
            if (f.id === folderId) {
              return {
                ...f,
                files: f.files.filter(file => file.id !== fileToDelete.id)
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
    setShowDeleteFileModal(false);
    setFileToDelete(null);
    
    // إزالة الملف من التحديد إن كان محدداً
    if (selectedFiles.has(fileToDelete.id)) {
      const newSelected = new Set(selectedFiles);
      newSelected.delete(fileToDelete.id);
      setSelectedFiles(newSelected);
    }
  };

  const handlePinFile = async (file) => {
    if (!folder) return;

    const updatedCategories = appState.archiveCategories.map(cat => {
      if (cat.id === folder.categoryId) {
        return {
          ...cat,
          folders: cat.folders.map(f => {
            if (f.id === folderId) {
              return {
                ...f,
                files: f.files.map(fi => 
                  fi.id === file.id ? { ...fi, isPinned: !fi.isPinned } : fi
                )
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

  if (!isOpen || !folder || !category) return null;

  const files = folder.files || [];
  const fileCount = files.length;

  return (
    <div className="fvm-overlay-backdrop" onClick={onClose}>
      <main 
        className="fvm-overlay" 
        role="dialog" 
        aria-label="تفاصيل المجلد"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="fvm-header">
          <div className="fvm-head-title">{folder.name}</div>
          <button 
            className="fvm-close" 
            aria-label="إغلاق" 
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="fvm-content">
          <section className="fvm-folder-summary">
            <div className="fvm-details">
              <div className="fvm-detail">
                <span className="fvm-detail-label">الفئة</span>
                <span className="fvm-detail-value">{category.name}</span>
              </div>
              <div className="fvm-detail">
                <span className="fvm-detail-label">الوصف</span>
                <span className="fvm-detail-value">
                  {folder.description || 'لا يوجد وصف'}
                </span>
              </div>
            </div>
            <div className="fvm-folder-actions">
              <button 
                className="fvm-small-btn" 
                onClick={() => onMove(folderId)}
              >
                نقل إلى فئة
              </button>
              <button 
                className="fvm-folder-delete-btn" 
                type="button"
                onClick={() => onDelete(folderId)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4h8v2m3 0-.9 14H5.9L5 6m4 4v6m6-6v6"/>
                </svg>
                <span>حذف المجلد</span>
              </button>
              <button 
                className="fvm-text-btn" 
                onClick={() => onEdit(folderId)}
              >
                تعديل التفاصيل
              </button>
            </div>
          </section>

          <section className="fvm-file-section">
            <div className="fvm-section-head">
              <div className="fvm-section-title">
                الملفات <span className="fvm-count">({fileCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  className={`fvm-small-btn ${folder.isPinned ? 'pinned-folder' : ''}`}
                  title="تثبيت المجلد في الشريط الجانبي"
                  onClick={handlePinFolder}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                    {folder.isPinned ? (
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
                  {folder.isPinned ? 'إزالة التثبيت' : 'تثبيت في الشريط الجانبي'}
                </button>
                <label 
                  className="fvm-primary" 
                  style={{ cursor: 'pointer' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4"/>
                  </svg>
                  إضافة ملفات
                  <input 
                    type="file" 
                    multiple 
                    hidden 
                    onChange={handleAddFiles}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            <div className={`fvm-bulk ${selectedFiles.size > 0 ? 'visible' : ''}`}>
              <span className="fvm-selected-label">
                تم تحديد {selectedFiles.size}
              </span>
              <button 
                className="fvm-small-btn danger" 
                onClick={handleDeleteSelected}
              >
                حذف
              </button>
              <button 
                className="fvm-text-btn" 
                onClick={handleClearSelection}
              >
                إلغاء التحديد
              </button>
            </div>

            <div className="fvm-file-list">
              {fileCount === 0 ? (
                <div className="fvm-empty">
                  لا توجد ملفات في هذا المجلد — أضف ملفات للبدء
                </div>
              ) : (
                files.map(file => (
                  <div 
                    key={file.id} 
                    className={`fvm-file-row ${selectedFiles.has(file.id) ? 'selected' : ''}`}
                    data-id={file.id}
                  >
                    <input 
                      className="fvm-check" 
                      type="checkbox" 
                      aria-label={`تحديد الملف ${file.originalFileName || file.name}`}
                      checked={selectedFiles.has(file.id)}
                      onChange={() => handleToggleFileSelection(file.id)}
                    />
                    <div className="fvm-file-type">
                      {getFileExtension(file.originalFileName || file.name)}
                    </div>
                    <div 
                      style={{ minWidth: 0, cursor: 'pointer' }}
                      onClick={() => handleOpenFile(file)}
                    >
                      <div 
                        className="fvm-file-name" 
                        title={file.originalFileName || file.name}
                      >
                        {file.originalFileName || file.name}
                      </div>
                      <div className="fvm-file-sub">
                        ملف {getFileExtension(file.originalFileName || file.name)}
                      </div>
                    </div>
                    <div className="fvm-file-size">
                      {formatFileSize(file.size)}
                    </div>
                    <div className="fvm-file-actions">
                      <button 
                        className={`fvm-pin-btn ${file.isPinned ? 'pinned' : ''}`}
                        title={file.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
                        aria-label={file.isPinned ? 'إلغاء تثبيت الملف' : 'تثبيت الملف'}
                        onClick={() => handlePinFile(file)}
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
                        className="fvm-delete-btn" 
                        title="حذف الملف" 
                        aria-label="حذف الملف"
                        onClick={() => handleDeleteFile(file)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M8 6V4h8v2m3 0-.9 14H5.9L5 6m4 4v6m6-6v6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <footer className="fvm-footer">
          <span>{fileCount} ملف</span>
          <span>يتم حفظ التغييرات تلقائيًا في هذا النموذج</span>
        </footer>
      </main>

      {/* Delete File Confirmation Modal */}
      {showDeleteFileModal && fileToDelete && (
        <div 
          className="fvm-dialog-backdrop" 
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteFileModal(false);
            setFileToDelete(null);
          }}
        >
          <div 
            className="fvm-dialog" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fvm-dialog-content">
              <h2 className="fvm-dialog-title">حذف الملف؟</h2>
              <p className="fvm-dialog-message">
                سيتم حذف الملف <strong>{fileToDelete.originalFileName || fileToDelete.name}</strong> بشكل نهائي. 
                هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="fvm-dialog-actions">
                <button 
                  className="fvm-dialog-btn danger"
                  onClick={confirmDeleteFile}
                >
                  حذف الملف
                </button>
                <button 
                  className="fvm-dialog-btn secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteFileModal(false);
                    setFileToDelete(null);
                  }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderViewModal;
