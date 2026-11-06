import React, { useState, useRef } from 'react';
import '../../styles/reorder-modal.css';

const ReorderTemplatesModal = ({ templates, onClose, onSave }) => {
    const [orderedTemplates, setOrderedTemplates] = useState([...templates]);
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
        const templatesCopy = [...orderedTemplates];
        const draggedItemContent = templatesCopy[dragItem.current];
        
        templatesCopy.splice(dragItem.current, 1);
        templatesCopy.splice(dragOverItem.current, 0, draggedItemContent);
        
        dragItem.current = null;
        dragOverItem.current = null;
        setDraggedIndex(null);
        
        setOrderedTemplates(templatesCopy);
    };

    const handleSave = () => {
        const templatesWithOrder = orderedTemplates.map((template, index) => ({
            ...template,
            order: index
        }));
        onSave(templatesWithOrder);
        onClose();
    };

    const getNormalizedType = (template) => {
        const raw = (template.fileType || template.fileName?.split('.').pop() || 'DOCX').toUpperCase();
        if (raw === 'WORD' || raw === 'DOC') return 'DOCX';
        if (raw === 'EXCEL' || raw === 'XLS' || raw === 'CSV') return 'XLSX';
        if (raw === 'POWERPOINT' || raw === 'PPT') return 'PPTX';
        return raw;
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'DOCX': return '#2563eb';
            case 'XLSX': return '#16a34a';
            case 'PPTX': return '#dc2626';
            case 'PDF': return '#ea580c';
            default: return '#6366f1';
        }
    };

    return (
        <div className="reorder-modal-overlay" onClick={onClose}>
            <div className="reorder-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="reorder-modal-header">
                    <h2>
                        <svg className="header-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                        </svg>
                        ترتيب القوالب
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
                    <span>اسحب القوالب لإعادة ترتيبها حسب استخدامك</span>
                </div>

                {/* List Items */}
                <div className="reorder-list">
                    {orderedTemplates.map((template, index) => {
                        const type = getNormalizedType(template);
                        const typeColor = getTypeColor(type);
                        
                        return (
                            <div
                                key={template.id}
                                className={`reorder-item ${draggedIndex === index ? 'dragging' : ''}`}
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

                                {/* Template Info */}
                                <div className="reorder-item-content">
                                    <div className="item-icon template-icon" style={{ backgroundColor: typeColor + '20', color: typeColor }}>
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                                        </svg>
                                    </div>
                                    <div className="item-info">
                                        <span className="item-name">
                                            {template.name}
                                            <span 
                                                className="type-badge-small" 
                                                style={{ backgroundColor: typeColor }}
                                            >
                                                {type}
                                            </span>
                                        </span>
                                        <span className="item-count">
                                            {template.fileName || 'ملف قالب'}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Number */}
                                <div className="order-number">#{index + 1}</div>
                            </div>
                        );
                    })}
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

export default ReorderTemplatesModal;
