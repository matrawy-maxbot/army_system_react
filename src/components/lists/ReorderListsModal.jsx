import React, { useState, useRef } from 'react';
import '../../styles/reorder-modal.css';

const ReorderListsModal = ({ lists, onClose, onSave }) => {
    const [orderedLists, setOrderedLists] = useState([...lists]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    const handleDragStart = (index) => {
        dragItem.current = index;
        setDraggedIndex(index);
    };

    const handleDragEnter = (index) => {
        dragOverItem.current = index;
    };

    const handleDragEnd = () => {
        const listsCopy = [...orderedLists];
        const draggedItemContent = listsCopy[dragItem.current];
        
        // إزالة العنصر من موقعه القديم
        listsCopy.splice(dragItem.current, 1);
        
        // إضافته في الموقع الجديد
        listsCopy.splice(dragOverItem.current, 0, draggedItemContent);
        
        dragItem.current = null;
        dragOverItem.current = null;
        setDraggedIndex(null);
        
        setOrderedLists(listsCopy);
    };

    const handleSave = () => {
        // إضافة قيم order جديدة
        const listsWithOrder = orderedLists.map((list, index) => ({
            ...list,
            order: index
        }));
        onSave(listsWithOrder);
        onClose();
    };

    return (
        <div className="reorder-modal-overlay" onClick={onClose}>
            <div className="reorder-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="reorder-modal-header">
                    <h2>
                        <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 8h18" />
                            <path d="M3 16h18" />
                            <path d="M11 3v18" />
                        </svg>
                        ترتيب القوائم
                    </h2>
                    <button className="close-btn" onClick={onClose} title="إغلاق">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Description */}
                <div className="reorder-modal-description">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 14h-2v-6h2v6zm0-8h-2V6h2v2z"/>
                    </svg>
                    <span>اسحب العناصر لإعادة ترتيبها حسب تفضيلاتك</span>
                </div>

                {/* List Items */}
                <div className="reorder-list">
                    {orderedLists.map((list, index) => (
                        <div
                            key={list.id}
                            className={`reorder-item ${draggedIndex === index ? 'dragging' : ''} ${list.isDefault ? 'default' : ''}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {/* Drag Handle */}
                            <div className="drag-handle" title="اسحب لإعادة الترتيب">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="9" cy="5" r="1" />
                                    <circle cx="9" cy="12" r="1" />
                                    <circle cx="9" cy="19" r="1" />
                                    <circle cx="15" cy="5" r="1" />
                                    <circle cx="15" cy="12" r="1" />
                                    <circle cx="15" cy="19" r="1" />
                                </svg>
                            </div>

                            {/* List Info */}
                            <div className="reorder-item-content">
                                <div className="item-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                                        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                                        <path d="M9 12l2 2l4 -4" />
                                    </svg>
                                </div>
                                <div className="item-info">
                                    <span className="item-name">
                                        {list.name}
                                        {list.isDefault && (
                                            <span className="default-badge">افتراضية</span>
                                        )}
                                    </span>
                                    <span className="item-count">
                                        {list.items?.length || 0} عنصر
                                    </span>
                                </div>
                            </div>

                            {/* Order Number */}
                            <div className="order-number">#{index + 1}</div>
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="reorder-modal-footer">
                    <button className="btn-save" onClick={handleSave}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                        حفظ الترتيب
                    </button>
                    <button className="btn-cancel" onClick={onClose}>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReorderListsModal;
