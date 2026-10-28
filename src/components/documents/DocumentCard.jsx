import React from 'react';
import './DocumentCard.css';

const DocumentCard = ({ document, categoryId, onOpenDetail, onOpenSettings }) => {
  // عرض الأيقونة - استخدام بروتوكول asset://
  const renderIcon = () => {
    if (document.icon && document.icon.includes('_')) {
      const iconUrl = `asset://${encodeURIComponent(document.icon)}`;
      return (
        <img 
          src={iconUrl} 
          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} 
          alt={document.name}
          onError={(e) => {
            e.target.outerHTML = `
              <div class="task-icon">
                <svg class="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                </svg>
              </div>
            `;
          }}
        />
      );
    } else {
      return (
        <div 
          className="task-icon" 
          dangerouslySetInnerHTML={{ 
            __html: document.icon || `
              <svg class="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
              </svg>
            `
          }}
        />
      );
    }
  };

  const handleCardClick = (e) => {
    // إذا نقر على زر الإعدادات، لا تفتح التفاصيل
    if (e.target.closest('.doc-settings-btn')) {
      return;
    }
    onOpenDetail(document.id, categoryId);
  };

  const handleSettingsClick = (e) => {
    e.stopPropagation();
    onOpenSettings(document.id, categoryId);
  };

  return (
    <div 
      className="task-card clickable-card" 
      onClick={handleCardClick}
      style={{ position: 'relative' }}
    >
      {renderIcon()}
      <div className="task-title">{document.name}</div>
      <div className="task-meta">{document.originalFileName || document.file || 'لا يوجد ملف'}</div>
      <button 
        className="doc-settings-btn" 
        data-doc-id={document.id} 
        data-category-id={categoryId} 
        title="إعدادات الاختصار"
        onClick={handleSettingsClick}
      >
        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
        </svg>
      </button>
    </div>
  );
};

export default DocumentCard;
