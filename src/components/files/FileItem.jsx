import React from 'react';
import FileThumbnail from './FileThumbnail';

const FileItem = ({ file, isSelected, onToggleSelect, onPrint, onDelete, onOpenFolder }) => {
    const handleClick = (e) => {
        const target = e.target.closest('[data-action]');
        const action = target?.dataset.action;

        if (action === 'checkbox') {
            onToggleSelect();
        } else if (action === 'folder') {
            e.stopPropagation();
            onOpenFolder();
        } else if (action === 'print') {
            e.stopPropagation();
            onPrint();
        } else if (action === 'delete') {
            e.stopPropagation();
            onDelete();
        } else {
            // النقر على أي مكان آخر يفتح الملف
            onOpenFolder();
        }
    };

    return (
        <div 
            className={`file-item ${isSelected ? 'selected' : ''}`}
            data-file-path={file.path}
            onClick={handleClick}
        >
            {/* دائرة التحديد */}
            <div className="file-checkbox" data-action="checkbox"></div>

            {/* الصورة المصغرة */}
            <FileThumbnail file={file} />

            {/* معلومات الملف */}
            <div className="file-info-overlay">
                <div className="file-info-name">{file.name}</div>
                <div className="file-info-time">{file.time || ''}</div>
            </div>

            {/* الأزرار */}
            <div className="file-item-actions">
                <button 
                    className="file-action-btn folder-btn" 
                    data-action="folder" 
                    title="فتح المجلد"
                >
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>
                <button 
                    className="file-action-btn print-btn" 
                    data-action="print" 
                    title="طباعة"
                >
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                        <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                        <path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4" />
                    </svg>
                </button>
                <button 
                    className="file-action-btn delete-btn" 
                    data-action="delete" 
                    title="حذف"
                >
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1" />
                        <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FileItem;
