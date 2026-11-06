import React, { useState } from 'react';

const AddTaskModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            alert('يرجى إدخال عنوان المهمة');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="task-modal-container" onClick={(e) => e.stopPropagation()}>
                <form className="task-modal-content" onSubmit={handleSubmit}>
                    <h2>مهمة جديدة</h2>
                    
                    <label className="task-field">
                        <span>عنوان المهمة</span>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="اكتب عنوانًا واضحًا"
                            maxLength="100"
                            autoFocus
                            required
                        />
                    </label>
                    
                    <label className="task-field">
                        <span>تفاصيل (اختياري)</span>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="أضف وصفًا مختصرًا"
                            maxLength="180"
                        />
                    </label>
                    
                    <div className="task-modal-actions">
                        <button className="task-primary" type="submit">
                            حفظ المهمة
                        </button>
                        <button className="task-secondary" type="button" onClick={onClose}>
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
