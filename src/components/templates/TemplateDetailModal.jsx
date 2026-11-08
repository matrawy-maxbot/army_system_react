import React, { useState, useEffect } from 'react';
import './TemplateDetailModal.css';

const TemplateDetailModal = ({ template, isOpen, onClose, onUseTemplate, onDownloadTemplate }) => {
    const [currentZoom, setCurrentZoom] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 2;

    useEffect(() => {
        if (isOpen) {
            setCurrentZoom(100);
            setCurrentPage(1);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen || !template) return null;

    const handleZoomIn = () => {
        setCurrentZoom(Math.min(150, currentZoom + 10));
    };

    const handleZoomOut = () => {
        setCurrentZoom(Math.max(60, currentZoom - 10));
    };

    const handleZoomReset = () => {
        setCurrentZoom(100);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleUse = () => {
        if (onUseTemplate) {
            onUseTemplate(template);
        }
    };

    const handleDownload = () => {
        if (onDownloadTemplate) {
            onDownloadTemplate(template);
        }
    };

    const formatFileSize = (fileName) => {
        // محاكاة حجم الملف - يمكن استبداله بحجم حقيقي
        return '42.8 KB';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '8 نوفمبر 2026';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className={`template-modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
            <div className="template-modal">
                {/* Header */}
                <header className="template-modal-header">
                    <div className="modal-heading">
                        <span id="modalTemplateName">{template.name}</span>
                        <span className="doc-badge">{template.fileType}</span>
                    </div>
                    <button className="modal-close" onClick={onClose} title="إغلاق">
                        &times;
                    </button>
                </header>

                {/* Body */}
                <div className="template-modal-body">
                    {/* Details Sidebar */}
                    <aside className="template-details">
                        <div className="details-label">تفاصيل القالب</div>
                        <h3 id="detailTemplateName">{template.name}</h3>
                        <p className="details-description">
                            ملف {template.fileType === 'DOCX' ? 'Word' : template.fileType === 'XLSX' ? 'Excel' : template.fileType === 'PPTX' ? 'PowerPoint' : 'PDF'} قابل للتعديل والاستخدام لإنشاء المستندات.
                        </p>

                        <div className="details-list">
                            <div className="detail-row">
                                <span>نوع الملف</span>
                                <strong>{template.fileType}</strong>
                            </div>
                            <div className="detail-row">
                                <span>حجم الملف</span>
                                <strong>{formatFileSize(template.fileName)}</strong>
                            </div>
                            <div className="detail-row">
                                <span>المجلد</span>
                                <strong>القوالب العامة</strong>
                            </div>
                            <div className="detail-row">
                                <span>تاريخ الإضافة</span>
                                <strong>{formatDate(template.createdAt)}</strong>
                            </div>
                            <div className="detail-row">
                                <span>الحالة</span>
                                <strong className="status-active">متاح للاستخدام</strong>
                            </div>
                        </div>

                        <div className="details-note">
                            يمكنك معاينة محتوى القالب قبل استخدامه.
                            لن يتم تعديل الملف الأصلي عند المعاينة.
                        </div>

                        {/* Actions */}
                        <div className="details-actions">
                            <button className="btn-primary" onClick={handleUse}>
                                استخدام القالب ↗
                            </button>
                            <button className="btn-secondary" onClick={handleDownload}>
                                تنزيل الملف ↓
                            </button>
                        </div>
                    </aside>

                    {/* Document Preview */}
                    <section className="template-viewer">
                        {/* Toolbar */}
                        <div className="viewer-toolbar">
                            <span className="viewer-title">معاينة المستند</span>
                            <div className="zoom-controls">
                                <button onClick={handleZoomOut} title="تصغير">−</button>
                                <span id="zoomValue">{currentZoom}%</span>
                                <button onClick={handleZoomIn} title="تكبير">+</button>
                                <button onClick={handleZoomReset} title="إعادة تعيين">↺</button>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className="viewer-stage">
                            {template.thumbnailPath || template.previewImage ? (
                                <div
                                    className="document-preview-image"
                                    style={{ transform: `scale(${currentZoom / 100})` }}
                                >
                                    <img 
                                        src={template.thumbnailPath || template.previewImage} 
                                        alt={template.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="document-preview-placeholder"
                                    style={{ transform: `scale(${currentZoom / 100})` }}
                                >
                                    <div className="placeholder-icon">
                                        <svg
                                            width="64"
                                            height="64"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                                            <path d="M9 15l2 2l4 -4" />
                                        </svg>
                                    </div>
                                    <div className="placeholder-title">لا توجد معاينة متاحة</div>
                                    <div className="placeholder-subtitle">
                                        استخدم القالب لفتحه ومعاينة محتواه
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="viewer-footer">
                            <span>معاينة المستند</span>
                            <div className="page-controls">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    title="الصفحة السابقة"
                                >
                                    السابق
                                </button>
                                <span id="pageCounter">{currentPage} / {totalPages}</span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    title="الصفحة التالية"
                                >
                                    التالي
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TemplateDetailModal;
