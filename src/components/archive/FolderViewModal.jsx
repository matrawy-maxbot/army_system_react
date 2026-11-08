/**
 * FolderViewModal Component
 * نافذة عرض محتويات المجلد - Enterprise Minimal Design
 */

import { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { electronAPI } from '../../services';
import AddToListsModal from '../common/AddToListsModal';
import FileDetailModal from './FileDetailModal';
import './FolderViewModal.css';

const FolderViewModal = ({ isOpen, onClose, folderId, onEdit, onMove, onDelete }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showAddToListsModal, setShowAddToListsModal] = useState(false);
  const [showMoveFilesModal, setShowMoveFilesModal] = useState(false);
  const [showFileDetailModal, setShowFileDetailModal] = useState(false);
  const [selectedFileForDetail, setSelectedFileForDetail] = useState(null);

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
    // فتح مودال تفاصيل الملف بدلاً من فتح الملف مباشرة
    setSelectedFileForDetail({
      ...file,
      categoryId: folder.categoryId,
      folderId: folder.id,
      categoryName: category.name,
      folderName: folder.name
    });
    setShowFileDetailModal(true);
  };

  const handleToggleFolderFavorite = () => {
    setShowAddToListsModal(true);
  };

  const handleOpenFolderPath = async () => {
    try {
      if (folder.path) {
        await electronAPI.showItemInFolder(folder.path);
      } else {
        alert('مسار المجلد غير متوفر');
      }
    } catch (err) {
      console.error('Error opening folder path:', err);
      alert('فشل في فتح مسار المجلد');
    }
  };

  const handleToggleFileFavorite = (file) => {
    setSelectedFileForDetail({
      ...file,
      categoryId: folder.categoryId,
      folderId: folder.id,
      categoryName: category.name,
      folderName: folder.name
    });
    setShowAddToListsModal(true);
  };

  const handleMoveSelectedFiles = () => {
    if (selectedFiles.size === 0) return;
    setShowMoveFilesModal(true);
  };

  const handleConfirmMoveFiles = async (targetFolderId) => {
    if (!folder || selectedFiles.size === 0) return;

    const filesToMove = files.filter(f => selectedFiles.has(f.id));

    const updatedCategories = appState.archiveCategories.map(cat => {
      return {
        ...cat,
        folders: cat.folders.map(f => {
          // إزالة الملفات من المجلد الحالي
          if (f.id === folderId) {
            return {
              ...f,
              files: f.files.filter(file => !selectedFiles.has(file.id))
            };
          }
          // إضافة الملفات إلى المجلد المستهدف
          if (f.id === targetFolderId) {
            return {
              ...f,
              files: [...(f.files || []), ...filesToMove]
            };
          }
          return f;
        })
      };
    });

    setAppState({
      ...appState,
      archiveCategories: updatedCategories
    });

    await saveData();
    setSelectedFiles(new Set());
    setShowMoveFilesModal(false);
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
          <div className="fvm-head-left">
            <button 
              className="fvm-head-btn fvm-head-path-btn"
              aria-label="فتح مسار المجلد"
              title="فتح مسار المجلد"
              onClick={handleOpenFolderPath}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button 
              className="fvm-head-btn fvm-head-favorite-btn"
              aria-label="إضافة المجلد إلى قائمة"
              title="إضافة المجلد إلى قائمة"
              onClick={handleToggleFolderFavorite}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
              </svg>
            </button>
            <div className="fvm-head-title">{folder.name}</div>
          </div>
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
                className="fvm-small-btn" 
                onClick={() => {
                  // فتح مودال المفضلة للملف الأول (كمثال)
                  const firstFileId = Array.from(selectedFiles)[0];
                  const firstFile = files.find(f => f.id === firstFileId);
                  if (firstFile) {
                    handleToggleFileFavorite(firstFile);
                  }
                }}
              >
                إضافة إلى المفضلة
              </button>
              <button 
                className="fvm-small-btn" 
                onClick={handleMoveSelectedFiles}
              >
                نقل إلى مجلد
              </button>
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
                        className="fvm-favorite-btn"
                        title="إضافة إلى المفضلة"
                        aria-label="إضافة الملف إلى قائمة"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFileFavorite(file);
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                        </svg>
                      </button>
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

      {/* Add to Lists Modal */}
      <AddToListsModal
        isOpen={showAddToListsModal}
        onClose={() => setShowAddToListsModal(false)}
        item={{
          id: selectedFileForDetail?.id || folder.id,
          type: selectedFileForDetail ? 'file' : 'folder',
          title: selectedFileForDetail 
            ? (selectedFileForDetail.originalFileName || selectedFileForDetail.name)
            : folder.name,
          categoryName: category.name,
          folderName: folder.name
        }}
      />

      {/* Move Files Modal */}
      {showMoveFilesModal && (
        <div 
          className="fvm-dialog-backdrop" 
          onClick={(e) => {
            e.stopPropagation();
            setShowMoveFilesModal(false);
          }}
        >
          <div 
            className="fvm-dialog fvm-move-dialog" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fvm-dialog-content">
              <h2 className="fvm-dialog-title">نقل الملفات</h2>
              <p className="fvm-dialog-message">
                اختر المجلد الذي تريد نقل {selectedFiles.size} ملف إليه:
              </p>
              <div className="fvm-folder-select-list">
                {appState.archiveCategories?.map(cat => (
                  <div key={cat.id} className="fvm-folder-select-category">
                    <div className="fvm-folder-select-category-name">{cat.name}</div>
                    {cat.folders?.filter(f => f.id !== folderId).map(f => (
                      <button
                        key={f.id}
                        className="fvm-folder-select-item"
                        onClick={() => handleConfirmMoveFiles(f.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        {f.name}
                        <span className="fvm-folder-category-hint">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div className="fvm-dialog-actions">
                <button 
                  className="fvm-dialog-btn secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMoveFilesModal(false);
                  }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Detail Modal */}
      {showFileDetailModal && selectedFileForDetail && (
        <FileDetailModal
          file={selectedFileForDetail}
          onClose={() => {
            setShowFileDetailModal(false);
            setSelectedFileForDetail(null);
          }}
          onUpdate={async () => {
            // تحديث البيانات بعد تغيير في مودال التفاصيل
            const result = findFolder();
            if (result) {
              // يتم التحديث تلقائيًا من خلال AppState
            }
          }}
        />
      )}
    </div>
  );
};

export default FolderViewModal;
