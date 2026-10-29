/**
 * ArchiveCategoryCard Component
 * بطاقة عرض فئة أرشيف واحدة مع مجلداتها
 */

import { useState } from 'react';
import FolderGrid from './FolderGrid';
import './ArchiveCategoryCard.css';

const ArchiveCategoryCard = ({ category, onAddFolder, onOpenFolder }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`archive-category-card ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="archive-category-header" onClick={toggleCollapse}>
        <div className="archive-category-title">
          <div className="archive-category-toggle">
            <svg className="toggle-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 6l6 6l-6 6"/>
            </svg>
            <span>{category.name}</span>
          </div>
          <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 'normal' }}>
            ({category.folders?.length || 0} مجلد)
          </span>
        </div>
        <div className="archive-category-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="btn-add-folder"
            onClick={() => onAddFolder(category.id)}
          >
            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1" />
            </svg>
            إضافة مجلد
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="archive-folders-grid">
          <FolderGrid 
            folders={category.folders || []} 
            onOpenFolder={onOpenFolder}
          />
        </div>
      )}
    </div>
  );
};

export default ArchiveCategoryCard;
