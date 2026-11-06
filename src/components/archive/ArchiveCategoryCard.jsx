/**
 * ArchiveCategoryCard Component
 * بطاقة عرض فئة أرشيف واحدة مع مجلداتها - مطابق للتصميم HTML
 */

import { useState } from 'react';
import FolderGrid from './FolderGrid';
import './ArchiveCategoryCard.css';

const ArchiveCategoryCard = ({ category, onAddFolder, onOpenFolder, onPinFolder }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const foldersCount = category.folders?.length || 0;

  return (
    <section className={`archive-section ${isCollapsed ? 'closed' : ''}`}>
      <header className="category-header">
        <div className="category-info">
          <span className="category-name">{category.name}</span>
          <span className="category-count">({foldersCount} {foldersCount === 1 ? 'مجلد' : 'مجلدات'})</span>
        </div>
        <div className="category-actions">
          <button 
            className="add-folder"
            onClick={() => onAddFolder(category.id)}
          >
            + مجلد جديد
          </button>
          <button 
            className="collapse" 
            aria-label="طي الفئة"
            onClick={toggleCollapse}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6l6 -6" />
            </svg>
          </button>
        </div>
      </header>
      
      <div className="folder-grid">
        <FolderGrid 
          folders={category.folders || []} 
          onOpenFolder={onOpenFolder}
          onPinFolder={onPinFolder}
        />
      </div>
    </section>
  );
};

export default ArchiveCategoryCard;
