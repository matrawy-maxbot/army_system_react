import React from 'react';

const TemplateCard = ({ template, onOpen, onEdit, onDelete }) => {
    const getNormalizedType = () => {
        const raw = (template.fileType || template.fileName?.split('.').pop() || 'DOCX').toUpperCase();
        if (raw === 'WORD' || raw === 'DOC') return 'DOCX';
        if (raw === 'EXCEL' || raw === 'XLS' || raw === 'CSV') return 'XLSX';
        if (raw === 'POWERPOINT' || raw === 'PPT') return 'PPTX';
        return raw;
    };

    const type = getNormalizedType();

    // عرض صورة مصغرة إذا كانت موجودة، وإلا عرض no-preview
    const hasThumbnail = template.thumbnailPath || template.thumbnail;

    const renderPreview = () => {
        if (hasThumbnail) {
            // في المستقبل: عرض الصورة المصغرة الحقيقية
            return (
                <div className="document" aria-hidden="true">
                    <img 
                        src={template.thumbnailPath || template.thumbnail} 
                        alt={template.name}
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain' 
                        }}
                    />
                </div>
            );
        }

        // عرض no-preview بشكل افتراضي
        return (
            <div className="no-preview" aria-hidden="true">
                <div className="no-preview-icon">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                        <line x1="9" y1="11" x2="13" y2="11" />
                    </svg>
                </div>
                <div className="no-preview-title">لا توجد معاينة متاحة</div>
                <div className="no-preview-subtitle">افتح الملف للاطلاع على محتواه</div>
            </div>
        );
    };

    return (
        <article className="template-card" data-name={template.name} data-file-type={type}>
            <div
                className="template-preview"
                onClick={onOpen}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpen()}
            >
                {renderPreview()}

                {/* File Type Badge */}
                <div className="file-type-badge">{type}</div>

                {/* Card Actions - Top Right */}
                <div className="template-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        className="action-btn action-edit"
                        title="تعديل الاسم"
                        onClick={onEdit}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="action-btn action-delete"
                        title="حذف"
                        onClick={onDelete}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="template-info">
                <span className="template-name">{template.name}</span>
            </div>
        </article>
    );
};

export default TemplateCard;
