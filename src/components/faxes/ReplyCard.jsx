/**
 * ReplyCard Component
 * بطاقة عرض الرد على الفاكس
 */

import React from 'react';

const ReplyCard = ({ reply, isSelected, onSelect, onClick, onDelete }) => {
    const fileType = (reply.fileType || 'docx').toLowerCase();
    const attachments = reply.attachments || []; // الملفات والصور المرفقة
    const hasAttachments = attachments.length > 0;

    const handleClick = () => {
        onClick(reply.id);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    };

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        onSelect(reply.id);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(reply);
    };

    const handleOpenClick = (e) => {
        e.stopPropagation();
        handleClick();
    };

    const getFileIcon = () => {
        switch (fileType) {
            case 'docx':
            case 'doc':
                return (
                    <svg className="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                        <path d="M9 9h6"/>
                        <path d="M9 13h6"/>
                        <path d="M9 17h4"/>
                    </svg>
                );
            case 'xlsx':
            case 'xls':
                return (
                    <svg className="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                        <path d="M9 9l6 8"/>
                        <path d="M15 9l-6 8"/>
                    </svg>
                );
            default:
                return (
                    <svg className="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                    </svg>
                );
        }
    };

    const getStatusColor = () => {
        switch (reply.status) {
            case 'completed':
                return 'is-completed';
            case 'in_progress':
                return 'is-in-progress';
            case 'draft':
            default:
                return 'is-draft';
        }
    };

    const getStatusText = () => {
        switch (reply.status) {
            case 'completed':
                return 'مكتمل';
            case 'in_progress':
                return 'قيد العمل';
            case 'draft':
            default:
                return 'مسودة';
        }
    };

    const getPreviewSubtext = () => {
        switch (fileType) {
            case 'docx':
            case 'doc':
                return 'Microsoft Word مستند';
            case 'xlsx':
            case 'xls':
                return 'Microsoft Excel مستند';
            default:
                return 'مستند';
        }
    };

    const getFileTypeText = () => {
        switch (fileType) {
            case 'docx':
            case 'doc':
                return 'DOCX';
            case 'xlsx':
            case 'xls':
                return 'XLSX';
            default:
                return (reply.fileType || 'FILE').toUpperCase();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <article
            className={`fax-reply-card fax-reply-card--${reply.status} ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`فتح الرد ${reply.name}`}
            title={getStatusText()}
        >
            {/* Badge اسم الفاكس الثابت */}
            <div className="fax-reply-card__fax-badge">
                <svg className="svg-icon-xs" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                </svg>
                <span>{reply.faxName}</span>
            </div>

            <div className="fax-reply-card__preview-box">
                {/* عرض الملفات المكدسة إذا كانت موجودة */}
                {hasAttachments && attachments.length > 1 && (
                    <div className="reply-attachments-stack">
                        {attachments.slice(0, 3).map((attachment, index) => (
                            <div 
                                key={attachment.id || index} 
                                className="attachment-card-stacked"
                                style={{
                                    zIndex: 10 - index,
                                    transform: `translateX(${index * -8}px) translateY(${index * -8}px)`,
                                }}
                            >
                                {attachment.type === 'image' ? (
                                    <img src={attachment.preview || attachment.url} alt="" />
                                ) : (
                                    <div className="attachment-placeholder">
                                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                            <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                        {attachments.length > 3 && (
                            <div className="attachments-count-badge">
                                +{attachments.length - 3}
                            </div>
                        )}
                    </div>
                )}
                
                <div className="fax-reply-card__actions-overlay">
                    {/* زر التحديد في الـ overlay */}
                    <div className="fax-reply-card__checkbox-overlay">
                        <div className={`fax-reply-checkbox ${isSelected ? 'checked' : ''}`} onClick={handleCheckboxClick}>
                            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>

                    {/* زر الحذف في الـ overlay */}
                    <div className="fax-reply-card__delete-overlay">
                        <button
                            className="fax-reply-card__delete-btn"
                            onClick={handleDeleteClick}
                            title="حذف الرد"
                            aria-label={`حذف الرد ${reply.name}`}
                        >
                            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1"/>
                                <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={`fax-reply-card__placeholder file-type-${fileType}`}>
                    <div className="fax-reply-card__placeholder-icon-wrap">{getFileIcon()}</div>
                    <p className="fax-reply-card__preview-caption">{getPreviewSubtext()}</p>
                </div>

                <div className="fax-reply-card__preview-overlay">
                    <button className="fax-reply-card__open-btn" onClick={handleOpenClick} title="فتح الملف">
                        فتح الملف
                        <span aria-hidden="true">↗</span>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ReplyCard;
