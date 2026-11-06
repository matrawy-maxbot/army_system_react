import React from 'react';

const TaskDetailModal = ({ task, onClose, onEdit, onDelete, onToggle }) => {
    const getRelativeDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        today.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) return 'اليوم';
        if (date.getTime() === yesterday.getTime()) return 'أمس';
        
        const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) return `منذ ${diffDays} يوم`;
        if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسبوع`;
        return `منذ ${Math.floor(diffDays / 30)} شهر`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="task-modal-container task-detail-modal-width" onClick={(e) => e.stopPropagation()}>
                <div className="task-modal-content">
                    <div className="task-detail-header-new">
                        <h2>تفاصيل المهمة</h2>
                        <button className="task-close-btn" onClick={onClose}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6l-12 12"/>
                                <path d="M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div className="task-detail-status">
                        <span className={`task-status-badge-lg ${task.isCompleted ? 'done' : ''}`}>
                            {task.isCompleted ? 'مكتملة' : 'قيد التنفيذ'}
                        </span>
                    </div>

                    <div className="task-detail-body">
                        <h3 className="task-detail-title-text">{task.title}</h3>
                        
                        {task.description && (
                            <div className="task-detail-description">
                                <span className="task-detail-label">الوصف:</span>
                                <p>{task.description}</p>
                            </div>
                        )}

                        <div className="task-detail-meta-row">
                            <div className="task-meta-item">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"/>
                                    <path d="M16 3v4"/>
                                    <path d="M8 3v4"/>
                                    <path d="M4 11h16"/>
                                </svg>
                                <div>
                                    <span className="meta-label-sm">تاريخ الإنشاء</span>
                                    <span className="meta-value-sm">{getRelativeDate(task.createdAt)}</span>
                                </div>
                            </div>

                            {task.isCompleted && task.completedAt && (
                                <div className="task-meta-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="12" cy="12" r="9"/>
                                        <path d="M9 12l2 2l4 -4" stroke="white" strokeWidth="2" fill="none"/>
                                    </svg>
                                    <div>
                                        <span className="meta-label-sm">تاريخ الإتمام</span>
                                        <span className="meta-value-sm">{getRelativeDate(task.completedAt)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="task-modal-actions task-detail-actions">
                        <button 
                            className="task-secondary"
                            onClick={() => {
                                onToggle(task.id);
                                setTimeout(() => {
                                    onClose();
                                }, 300);
                            }}
                        >
                            {task.isCompleted ? 'إلغاء الإتمام' : 'إتمام المهمة'}
                        </button>
                        
                        <div className="task-actions-group">
                            <button 
                                className="task-danger-btn"
                                onClick={() => {
                                    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
                                        onDelete(task.id);
                                        onClose();
                                    }
                                }}
                            >
                                حذف
                            </button>
                            
                            <button 
                                className="task-primary"
                                onClick={() => {
                                    onEdit(task);
                                    onClose();
                                }}
                            >
                                تعديل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
