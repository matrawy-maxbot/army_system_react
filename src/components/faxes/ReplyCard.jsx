/**
 * ReplyCard Component
 * بطاقة عرض الرد على الفاكس
 */

import React from 'react';

const ReplyCard = ({ reply, onClick, onDelete }) => {
    const handleClick = () => {
        onClick(reply.id);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(reply);
    };

    // أيقونة نوع الملف
    const getFileIcon = () => {
        switch (reply.fileType?.toLowerCase()) {
            case 'docx':
            case 'doc':
                return (
                    <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="#2B579A" stroke="currentColor" strokeWidth="1">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                        <path d="M9 9h1"/>
                        <path d="M9 13h6"/>
                        <path d="M9 17h6"/>
                    </svg>
                );
            case 'xlsx':
            case 'xls':
                return (
                    <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="#217346" stroke="currentColor" strokeWidth="1">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                        <path d="M9 12h6"/>
                        <path d="M12 9v6"/>
                    </svg>
                );
            default:
                return (
                    <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                    </svg>
                );
        }
    };

    // الحصول على لون الحالة
    const getStatusColor = () => {
        switch (reply.status) {
            case 'completed':
                return 'status-completed';
            case 'in_progress':
                return 'status-in-progress';
            case 'draft':
            default:
                return 'status-draft';
        }
    };

    // الحصول على نص الحالة
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

    // تنسيق التاريخ
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="reply-card" onClick={handleClick}>
            <div className="reply-card-header">
                <div className="reply-icon">
                    {getFileIcon()}
                </div>
                <button 
                    className="btn-delete-reply"
                    onClick={handleDeleteClick}
                    title="حذف الرد"
                >
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1"/>
                        <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z"/>
                    </svg>
                </button>
            </div>

            <div className="reply-card-body">
                <h3 className="reply-name">{reply.name}</h3>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="reply-fax-badge">
                        #{reply.faxNumber}
                    </span>
                    
                    {reply.templateName && (
                        <div className="reply-template-info">
                            <svg className="svg-icon-xs" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2"/>
                                <rect x="9" y="3" width="6" height="4" rx="2"/>
                            </svg>
                            <span>{reply.templateName}</span>
                        </div>
                    )}
                </div>

                {reply.note && (
                    <p className="reply-note">{reply.note}</p>
                )}
            </div>

            <div className="reply-card-footer">
                <div className={`reply-status ${getStatusColor()}`}>
                    <span className="status-dot"></span>
                    <span>{getStatusText()}</span>
                </div>
                <div className="reply-date">
                    <svg className="svg-icon-xs" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l.324 .001l.318 .004l.616 .017l.299 .013l.579 .034l.553 .046c4.785 .464 6.732 2.411 7.196 7.196l.046 .553l.034 .579c.005 .098 .01 .198 .013 .299l.017 .616l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.464 4.785 -2.411 6.732 -7.196 7.196l-.553 .046l-.579 .034c-.098 .005 -.198 .01 -.299 .013l-.616 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.785 -.464 -6.732 -2.411 -7.196 -7.196l-.046 -.553l-.034 -.579a28.058 28.058 0 0 1 -.013 -.299l-.017 -.616c-.003 -.21 -.005 -.424 -.005 -.642l.001 -.324l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.464 -4.785 2.411 -6.732 7.196 -7.196l.553 -.046l.579 -.034c.098 -.005 .198 -.01 .299 -.013l.616 -.017c.21 -.003 .424 -.005 .642 -.005zm0 5a1 1 0 0 0 -.993 .883l-.007 .117v5l.009 .131a1 1 0 0 0 .197 .477l.087 .1l3 3l.094 .082a1 1 0 0 0 1.226 0l.094 -.083l.083 -.094a1 1 0 0 0 0 -1.226l-.083 -.094l-2.293 -2.293v-4.586l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
                    </svg>
                    <span>{formatDate(reply.createdDate)}</span>
                </div>
            </div>
        </div>
    );
};

export default ReplyCard;
