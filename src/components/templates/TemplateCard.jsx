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
                <div className="no-preview-icon">▤</div>
                <span className="no-preview-title">لا توجد معاينة متاحة</span>
                <span className="no-preview-subtitle">افتح الملف للاطلاع على محتواه</span>
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

                <div className="template-overlay">
                    <div className="template-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="action-open"
                            data-action="open"
                            onClick={onOpen}
                            title="فتح الملف"
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
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            <span>فتح الملف</span>
                        </button>
                        <button
                            type="button"
                            className="action-edit"
                            data-action="edit"
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
                            className="action-delete"
                            data-action="delete"
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
            </div>

            <div className="template-info">
                <span className="template-name">{template.name}</span>
            </div>
        </article>
    );
};

export default TemplateCard;
