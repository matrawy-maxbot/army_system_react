import React, { useState } from 'react';

const AddReminderModal = ({ onClose, onSave }) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: todayStr,
        endDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('يرجى إدخال عنوان التذكير');
            return;
        }

        if (!formData.endDate) {
            alert('يرجى إدخال موعد الانتهاء');
            return;
        }

        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            alert('موعد الانتهاء يجب أن يكون بعد موعد البدء');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>إضافة تذكير</h2>
                    <button className="btn-close" onClick={onClose}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
                        </svg>
                    </button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>عنوان التذكير *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="أدخل عنوان التذكير"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>الوصف</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="أدخل وصف التذكير (اختياري)"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>تاريخ البدء *</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>تاريخ الانتهاء *</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            إلغاء
                        </button>
                        <button type="submit" className="btn-primary">
                            حفظ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReminderModal;
