/**
 * FolderCard Component
 * بطاقة عرض مجلد واحد - مطابق للتصميم HTML
 */

import './FolderCard.css';
import { useAppState } from '../../context/AppStateContext';

const FolderCard = ({ folder, onClick, onPinFolder }) => {
  const { appState } = useAppState();
  const filesCount = folder.files?.length || 0;
  
  // Find the category name for this folder
  const category = appState.archiveCategories?.find(cat => cat.id === folder.categoryId);
  const categoryName = category?.name || 'غير محدد';
  const folderPath = `${categoryName} / ${folder.name}`;
  
  const handlePinClick = (e) => {
    e.stopPropagation();
    if (onPinFolder) {
      onPinFolder(folder);
    }
  };
  
  return (
    <div 
      className="folder-card" 
      onClick={() => onClick(folder.id)}
      tabIndex={0}
      role="button"
      aria-label={`فتح المجلد ${folder.name}`}
    >
      <div className="card-top">
        <div className="folder-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
            <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H10l2 2h7.5A1.5 1.5 0 0 1 21 8.5v9 a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/>
          </svg>
        </div>
        <button 
          className={`card-pin-button ${folder.isPinned ? 'pinned' : ''}`}
          onClick={handlePinClick}
          aria-label={folder.isPinned ? 'إلغاء التثبيت' : 'تثبيت المجلد'}
          title={folder.isPinned ? 'إلغاء التثبيت' : 'تثبيت في الشريط الجانبي'}
        >
          {folder.isPinned ? (
            // أيقونة مثبت (Push Pin Filled)
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" />
              <path d="M9 15l-4.5 4.5" />
              <path d="M14.5 4l5.5 5.5" />
            </svg>
          ) : (
            // أيقونة غير مثبت (Push Pin Outline)
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" />
              <path d="M9 15l-4.5 4.5" />
              <path d="M14.5 4l5.5 5.5" />
            </svg>
          )}
        </button>
      </div>
      
      <strong className="folder-name">{folder.name}</strong>
      <span className="folder-path">{folderPath}</span>
      
      <div className="card-bottom">
        <span className="file-count">
          <strong>{filesCount}</strong> ملفات
        </span>
        <span className="open-label">فتح المجلد ←</span>
      </div>
    </div>
  );
};

export default FolderCard;
