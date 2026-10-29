import React, { useState } from 'react';

const AddListModal = ({ onClose, onSave }) => {
    const [listName, setListName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!listName.trim()) {
            alert('يرجى إدخال اسم القائمة');
            return;
        }

        onSave(listName.trim());
    };

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>إنشاء قائمة جديدة</h2>
                    <button className="btn-close" onClick={onClose}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
                        </svg>
                    </button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>اسم القائمة *</label>
                        <input
                            type="text"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            placeholder="أدخل اسم القائمة"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            إلغاء
                        </button>
                        <button type="submit" className="btn-primary">
                            إنشاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddListModal;
