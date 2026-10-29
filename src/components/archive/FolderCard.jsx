/**
 * FolderCard Component
 * بطاقة عرض مجلد واحد
 */

import './FolderCard.css';

const FolderCard = ({ folder, onClick }) => {
  const filesCount = folder.files?.length || 0;
  
  return (
    <div className="folder-card" onClick={() => onClick(folder.id)}>
      <div className="folder-card-icon">
        <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" />
        </svg>
      </div>
      
      <div className="folder-card-name">{folder.name}</div>
      
      {folder.description && (
        <div className="folder-card-desc">{folder.description}</div>
      )}
      
      <div className="folder-card-files-count">
        {filesCount} {filesCount === 1 ? 'ملف' : 'ملفات'}
      </div>
    </div>
  );
};

export default FolderCard;
