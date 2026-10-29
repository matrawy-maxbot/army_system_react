/**
 * SelectFaxModal Component
 * نافذة اختيار الفاكس المرتبط بالرد
 */

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Modal from '../common/Modal';
import './SelectModals.css';

const SelectFaxModal = ({ isOpen, onClose, onSelect, faxes, selectedFaxId }) => {
    const { appState } = useAppState();
    const [localSelectedId, setLocalSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // تحديث الاختيار المحلي عند فتح المودال
    React.useEffect(() => {
        if (isOpen) {
            setLocalSelectedId(selectedFaxId || null);
        }
    }, [isOpen, selectedFaxId]);

    // تصفية الفاكسات حسب البحث
    const filteredFaxes = faxes.filter(fax => 
        fax.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fax.faxNumber.toString().includes(searchQuery)
    );

    const handleSelect = () => {
        if (localSelectedId) {
            onSelect(localSelectedId);
        }
    };

    const handleFaxClick = (faxId) => {
        setLocalSelectedId(faxId);
    };

    // الحصول على صورة الصفحة الأولى من الفاكس
    const getFirstPageImage = (fax) => {
        const pages = appState.faxPages || [];
        const firstPageId = fax.pageIds?.[0];
        if (firstPageId) {
            const page = pages.find(p => p.id === firstPageId);
            return page?.thumbnailUrl;
        }
        return null;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="اختيار الفاكس"
            size="normal"
        >
            <div className="select-fax-modal">
                {/* شريط البحث */}
                <div className="search-bar">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="ابحث عن فاكس بالاسم أو الرقم..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button 
                            className="search-clear"
                            onClick={() => setSearchQuery('')}
                            aria-label="مسح البحث"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                            </svg>
                        </button>
                    )}
                </div>

                {/* معلومات مختصرة */}
                <div className="select-fax-info">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
                    </svg>
                    <p>اختر الفاكس الذي تريد إنشاء رد له</p>
                </div>

                {/* قائمة الفاكسات */}
                {filteredFaxes.length > 0 ? (
                    <div className="faxes-selection-grid">
                        {filteredFaxes.map(fax => {
                            const firstPageImage = getFirstPageImage(fax);
                            const isSelected = localSelectedId === fax.id;

                            return (
                                <div
                                    key={fax.id}
                                    className={`fax-selection-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleFaxClick(fax.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleFaxClick(fax.id);
                                        }
                                    }}
                                    aria-pressed={isSelected}
                                >
                                    <div className="fax-selection-image">
                                        {firstPageImage ? (
                                            <img src={firstPageImage} alt={`معاينة ${fax.name}`} />
                                        ) : (
                                            <div className="fax-selection-placeholder">
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z"/>
                                                </svg>
                                            </div>
                                        )}
                                        {isSelected && (
                                            <div className="selection-checkmark">
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="fax-selection-info">
                                        <div className="fax-header-compact">
                                            <span className="fax-number-badge">#{fax.faxNumber}</span>
                                            <span className="fax-pages-count">
                                                {(fax.pageIds?.length || 0) + (fax.dependentPageIds?.length || 0)} صفحة
                                            </span>
                                        </div>
                                        <h3>{fax.name}</h3>
                                        {fax.note && <p className="fax-note">{fax.note}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-results">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <p>لا توجد نتائج</p>
                    </div>
                )}

                {/* الأزرار */}
                <div className="modal-actions">
                    <button 
                        className="btn-primary" 
                        onClick={handleSelect}
                        disabled={!localSelectedId}
                    >
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"/>
                        </svg>
                        تأكيد الاختيار
                    </button>
                    <button className="btn-secondary" onClick={onClose}>
                        إلغاء
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SelectFaxModal;
