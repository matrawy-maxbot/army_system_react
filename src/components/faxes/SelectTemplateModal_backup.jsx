/**
 * SelectTemplateModal Component
 * نافذة اختيار القالب لإنشاء الرد
 */

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Modal from '../common/Modal';
import './SelectModals.css';

const SelectTemplateModal = ({ isOpen, onClose, onSelect, fax }) => {
    const { appState } = useAppState();
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // الحصول على القوالب من النظام
    const templates = appState.templates || [];

    // تصفية القوالب حسب البحث
    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (template) => {
        onSelect(template);
    };

    const handleCreateBlank = () => {
        onSelect(null); // null يعني مستند فارغ
    };

    // أيقونة نوع الملف
    const getFileIcon = (fileType) => {
        switch (fileType?.toLowerCase()) {
            case 'docx':
            case 'doc':
                return (
                    <svg viewBox="0 0 24 24" fill="#2B579A" stroke="currentColor" strokeWidth="1">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                        <path d="M9 9h1"/>
                        <path d="M9 13h6"/>
                        <path d="M9 17h6"/>
                    </svg>
                );
            case 'xlsx':
            case 'xls':
                return (
                    <svg viewBox="0 0 24 24" fill="#217346" stroke="currentColor" strokeWidth="1">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                        <path d="M9 12h6"/>
                        <path d="M12 9v6"/>
                    </svg>
                );
            case 'pdf':
                return (
                    <svg viewBox="0 0 24 24" fill="#DC3545" stroke="currentColor" strokeWidth="1">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                    </svg>
                );
            default:
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                    </svg>
                );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="اختيار قالب للرد"
            size="large"
        >
            <div className="select-template-modal">
                {/* معلومات الفاكس */}
                {fax && (
                    <div className="selected-fax-tag">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z"/>
                        </svg>
                        <span>#{fax.faxNumber}</span>
                    </div>
                )}

                {/* شريط البحث */}
                {templates.length > 0 && (
                    <div className="search-bar">
                        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="ابحث عن قالب..."
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
                )}

                {/* معلومات */}
                <div className="select-template-info">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
                    </svg>
                    <p>اختر قالباً لإنشاء نسخة منه كرد على الفاكس، أو أنشئ مستنداً فارغاً</p>
                </div>

                {/* بطاقة المستند الفارغ */}
                <div className="templates-section">
                    <h3 className="section-title">بدء جديد</h3>
                    <div 
                        className="template-card blank-document" 
                        onClick={handleCreateBlank}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleCreateBlank();
                            }
                        }}
                    >
                        <div className="template-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                                <path d="M12 11v6"/>
                                <path d="M9 14h6"/>
                            </svg>
                        </div>
                        <div className="template-info">
                            <h4>مستند فارغ</h4>
                            <p>إنشاء مستند DOCX جديد من الصفر</p>
                        </div>
                        <div className="template-action">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* قائمة القوالب */}
                {templates.length > 0 && (
                    <div className="templates-section">
                        <h3 className="section-title">
                            القوالب المتاحة
                            <span className="templates-count">({filteredTemplates.length})</span>
                        </h3>
                        
                        {filteredTemplates.length > 0 ? (
                            <div className="templates-grid">
                                {filteredTemplates.map(template => (
                                    <div
                                        key={template.id}
                                        className="template-card"
                                        onClick={() => handleSelect(template)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleSelect(template);
                                            }
                                        }}
                                    >
                                        <div className="template-icon">
                                            {getFileIcon(template.fileType)}
                                        </div>
                                        <div className="template-info">
                                            <h4>{template.name}</h4>
                                            <p className="template-type">
                                                {template.fileType?.toUpperCase() || 'مستند'}
                                            </p>
                                            {template.description && (
                                                <p className="template-description">{template.description}</p>
                                            )}
                                        </div>
                                        <div className="template-action">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2"/>
                                                <rect x="9" y="3" width="6" height="4" rx="2"/>
                                                <path d="M9 12h6"/>
                                                <path d="M9 16h6"/>
                                            </svg>
                                        </div>
                                    </div>
                                ))}
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
                    </div>
                )}

                {templates.length === 0 && (
                    <div className="no-templates-message">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                        </svg>
                        <p>لا توجد قوالب متاحة حالياً</p>
                        <p className="hint">يمكنك إضافة قوالب من قسم القوالب أو إنشاء مستند فارغ</p>
                    </div>
                )}

                {/* الأزرار */}
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        إلغاء
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SelectTemplateModal;
