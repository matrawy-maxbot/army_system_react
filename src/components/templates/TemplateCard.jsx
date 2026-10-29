import React, { useState } from 'react';

const TemplateCard = ({ template, onOpen, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(template.name);

    const getFileTypeIcon = (fileName) => {
        const ext = fileName?.split('.').pop()?.toLowerCase();
        
        const iconMap = {
            'docx': (
                <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#2B579A' }}>
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                    <path d="M9 9l1 0" />
                    <path d="M9 13l6 0" />
                    <path d="M9 17l6 0" />
                </svg>
            ),
            'xlsx': (
                <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#217346' }}>
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                    <path d="M7 14l5 -5" />
                    <path d="M12 14l-5 -5" />
                </svg>
            ),
            'pptx': (
                <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#D24726' }}>
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                    <path d="M11 16.5l-5 -3l5 -3z" />
                </svg>
            ),
            'pdf': (
                <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#F40F02' }}>
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                    <path d="M9 9l1 0" />
                    <path d="M9 13l3 0" />
                    <path d="M9 17l2 0" />
                </svg>
            )
        };

        return iconMap[ext] || iconMap['pdf'];
    };

    const handleSaveName = () => {
        if (newName.trim() && newName !== template.name) {
            onEdit(newName.trim());
        }
        setIsEditingName(false);
    };

    const handleCardClick = (e) => {
        if (!e.target.closest('.btn-icon-small') && !isEditingName) {
            onOpen();
        }
    };

    return (
        <div className="template-card" onClick={handleCardClick}>
            <div className="template-icon">
                {getFileTypeIcon(template.fileName)}
            </div>
            
            {isEditingName ? (
                <div style={{ width: '100%', padding: '0 10px' }}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                        autoFocus
                        style={{ width: '100%', padding: '5px', fontSize: '13px' }}
                    />
                </div>
            ) : (
                <h3 className="template-name">{template.name}</h3>
            )}
            
            <div className="template-file-type">{template.fileType}</div>
            <div className="template-file-name">{template.fileName}</div>

            <div className="template-actions">
                <button
                    className="btn-icon-small"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingName(true);
                    }}
                    title="تعديل الاسم"
                >
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                        <path d="M16 5l3 3" />
                    </svg>
                </button>
                <button
                    className="btn-icon-small danger"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
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

export default TemplateCard;
