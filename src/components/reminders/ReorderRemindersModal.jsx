import React, { useState, useRef } from 'react';
import '../../styles/reorder-modal.css';

const ReorderRemindersModal = ({ reminders, onClose, onSave }) => {
    const [orderedReminders, setOrderedReminders] = useState([...reminders]);
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
        const remindersCopy = [...orderedReminders];
        const draggedItemContent = remindersCopy[dragItem.current];
        
        remindersCopy.splice(dragItem.current, 1);
        remindersCopy.splice(dragOverItem.current, 0, draggedItemContent);
        
        dragItem.current = null;
        dragOverItem.current = null;
        setDraggedIndex(null);
        
        setOrderedReminders(remindersCopy);
    };

    const handleSave = () => {
        const remindersWithOrder = orderedReminders.map((reminder, index) => ({
            ...reminder,
            order: index
        }));
        onSave(remindersWithOrder);
        onClose();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            day: 'numeric',
            month: 'short'
        });
    };

    const getStatusInfo = (reminder) => {
        const isActive = reminder.isActive !== undefined ? reminder.isActive : true;
        if (!isActive) return { text: 'متوقف', color: '#94a3b8' };
        if (reminder.isExpired) return { text: 'منتهي', color: '#ef4444' };
        return { text: 'نشط', color: '#10b981' };
    };

    return (
        <div className="reorder-modal-overlay" onClick={onClose}>
            <div className="reorder-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="reorder-modal-header">
                    <h2>
                        <svg className="header-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"/>
                            <path d="M9 17v1a3 3 0 0 0 6 0v-1"/>
                        </svg>
                        ترتيب التذكيرات
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
                    <span>اسحب التذكيرات لإعادة ترتيبها حسب أولوياتك</span>
                </div>

                {/* List Items */}
                <div className="reorder-list">
                    {orderedReminders.map((reminder, index) => {
                        const status = getStatusInfo(reminder);
                        return (
                            <div
                                key={reminder.id}
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

                                {/* Reminder Info */}
                                <div className="reorder-item-content">
                                    <div className="item-icon reminder-icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"/>
                                            <path d="M9 17v1a3 3 0 0 0 6 0v-1"/>
                                        </svg>
                                    </div>
                                    <div className="item-info">
                                        <span className="item-name">
                                            {reminder.title}
                                            <span 
                                                className="status-badge-small" 
                                                style={{ backgroundColor: status.color }}
                                            >
                                                {status.text}
                                            </span>
                                        </span>
                                        <span className="item-count">
                                            ينتهي في {formatDate(reminder.endDate)}
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

export default ReorderRemindersModal;
