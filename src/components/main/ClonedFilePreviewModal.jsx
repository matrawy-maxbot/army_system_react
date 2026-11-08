/**
 * ClonedFilePreviewModal Component
 * مودال معاينة الملفات المستنسخة
 */

import React, { useEffect } from 'react';
import './ClonedFilePreviewModal.css';

const ClonedFilePreviewModal = ({ file, isOpen, onClose, onOpenDetails, onOpenFile }) => {
    useEffect(() => {
        if (isOpen) {
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

    if (!isOpen || !file) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getFileExtension = (filename) => {
        if (!filename) return 'FILE';
        const ext = filename.split('.').pop();
        return ext ? ext.toUpperCase().slice(0, 5) : 'FILE';
    };

    const extension = getFileExtension(file.originalFileName || file.name);
    const isFromTemplate = file.sourceType === 'template';

    return (
        <div 
            className={`cloned-preview-modal ${isOpen ? 'show' : ''}`}
            onClick={handleOverlayClick}
        >
            <div className="cloned-preview-modal-content">
                <div className="cloned-preview-modal-header">
                    <div className="cloned-preview-modal-title">
                        <span>{file.name}</span>
                        {isFromTemplate && (
                            <span className="cloned-source-badge template">من قالب</span>
                        )}
                        {!isFromTemplate && file.isCloned && (
                            <span className="cloned-source-badge cloned">نسخة</span>
                        )}
                    </div>
                    <button className="cloned-preview-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="cloned-preview-modal-body">
                    <div className="cloned-paper-large">
                        <span className={`cloned-type-large ${extension === 'DOCX' || extension === 'DOC' ? 'word' : extension === 'XLSX' || extension === 'XLS' ? 'excel' : extension === 'PPTX' || extension === 'PPT' ? 'ppt' : ''}`}>
                            {extension}
                        </span>
                        {extension === 'PDF' ? (
                            <>
                                <div className="paper-head"></div>
                                <div className="paper-line"></div>
                                <div className="paper-line medium"></div>
                                <div className="paper-line short"></div>
                                <div className="paper-gap"></div>
                                <div className="paper-line"></div>
                                <div className="paper-line medium"></div>
                                <div className="paper-block"></div>
                                <div className="paper-line"></div>
                                <div className="paper-line short"></div>
                                <div className="paper-table">
                                    <span></span><span></span><span></span>
                                    <span></span><span></span><span></span>
                                    <span></span><span></span><span></span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="paper-head"></div>
                                <div className="paper-gap"></div>
                                <div className="paper-line"></div>
                                <div className="paper-line"></div>
                                <div className="paper-line medium"></div>
                                <div className="paper-gap"></div>
                                <div className="paper-line"></div>
                                <div className="paper-line short"></div>
                                <div className="paper-block"></div>
                                <div className="paper-gap"></div>
                                <div className="paper-line"></div>
                                <div className="paper-line medium"></div>
                                <div className="paper-line"></div>
                            </>
                        )}
                    </div>
                </div>
                <div className="cloned-preview-modal-footer">
                    {!isFromTemplate && (
                        <>
                            <button 
                                className="cloned-preview-btn secondary"
                                onClick={() => onOpenDetails(file)}
                            >
                                عرض التفاصيل
                            </button>
                            <button 
                                className="cloned-preview-btn primary"
                                onClick={() => onOpenFile(file)}
                            >
                                فتح الملف ↗
                            </button>
                        </>
                    )}
                    {isFromTemplate && (
                        <div className="cloned-template-info">
                            <div className="template-info-item">
                                <span className="label">القالب الأصلي:</span>
                                <span className="value">{file.originalName}</span>
                            </div>
                            <div className="template-info-item">
                                <span className="label">مرتبط بـ:</span>
                                <span className="value">{file.folderName}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClonedFilePreviewModal;
