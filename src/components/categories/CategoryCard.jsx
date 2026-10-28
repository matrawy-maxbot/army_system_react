/**
 * CategoryCard Component
 * بطاقة عرض فئة واحدة مع مستنداتها
 */

import { useAppState } from '../../context/AppStateContext';
import CategoryIcon from './CategoryIcon';

const CategoryCard = ({ category, onEditCategory, onAddDocument }) => {
  const { appState } = useAppState();

  return (
    <div className="category-card">
      <div className="category-header">
        <div className="category-title">
          <CategoryIcon icon={category.icon} />
          <h2>{category.name}</h2>
        </div>
        <div className="category-actions">
          <button
            className="btn-category-action"
            onClick={() => onAddDocument(category.id)}
          >
            إضافة مستند
          </button>
          <button
            className="btn-category-action"
            onClick={() => onEditCategory(category.id)}
          >
            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
            </svg>
            إعدادات
          </button>
        </div>
      </div>
      <div className="category-content">
        <div className="category-documents-grid" id={`category-${category.id}`}>
          {!category.documents || category.documents.length === 0 ? (
            <div className="category-empty">
              <div className="category-empty-icon">
                <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <div>لا توجد مستندات في هذه الفئة</div>
            </div>
          ) : (
            category.documents.map((doc) => (
              <div
                key={doc.id}
                className="task-card clickable-card"
                style={{ position: 'relative' }}
              >
                {/* الأيقونة */}
                {doc.icon && doc.icon.includes('_') ? (
                  <img
                    src={`asset://${encodeURIComponent(doc.icon)}`}
                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                    alt={doc.name}
                    onError={(e) => {
                      e.target.outerHTML = `<div class="task-icon"><svg class="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/></svg></div>`;
                    }}
                  />
                ) : (
                  <div
                    className="task-icon"
                    dangerouslySetInnerHTML={{
                      __html:
                        doc.icon ||
                        '<svg class="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/></svg>',
                    }}
                  />
                )}
                
                <div className="task-title">{doc.name}</div>
                <div className="task-meta">{doc.originalFileName || doc.file || 'لا يوجد ملف'}</div>
                
                {/* زر الإعدادات */}
                <button
                  className="doc-settings-btn"
                  data-doc-id={doc.id}
                  data-category-id={category.id}
                  title="إعدادات الاختصار"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Open edit document modal
                  }}
                >
                  <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
