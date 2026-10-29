import React from 'react';

const ListCard = ({ list, onOpen, onDelete }) => {
    const itemsCount = list.items?.length || 0;

    const handleClick = (e) => {
        // إذا نقر على زر الحذف، لا تفتح المحتوى
        if (e.target.closest('.btn-icon-small')) {
            return;
        }
        onOpen();
    };

    return (
        <div className={`list-card ${list.isDefault ? 'default' : ''}`} onClick={handleClick}>
            <div className="list-card-header">
                <div className="list-icon">
                    <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                        <path d="M9 12l2 2l4 -4" />
                    </svg>
                </div>
                <h3 className="list-name">{list.name}</h3>
                {list.isDefault && <span className="list-badge">افتراضية</span>}
            </div>
            <div className="list-items-count">
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                </svg>
                <span>{itemsCount} {itemsCount === 1 ? 'عنصر' : 'عناصر'}</span>
            </div>
            {!list.isDefault && (
                <div className="list-actions">
                    <button 
                        className="btn-icon-small danger" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }} 
                        title="حذف القائمة"
                    >
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1" />
                            <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListCard;
