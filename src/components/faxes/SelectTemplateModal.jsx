/**
 * SelectTemplateModal Component - Redesigned
 * نافذة اختيار القالب لإنشاء الرد
 * 
 * UX Improvements:
 * - Compact, content-responsive modal size (700px max-width vs 1000px)
 * - Unified choice area (blank + templates)
 * - Fixed header with integrated search and context
 * - Scrollable content area with fixed footer
 * - Grid layout for templates (2-3 columns)
 * - Improved visual hierarchy and spacing
 */

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Modal from '../common/Modal';
import './SelectModals.css';

const SelectTemplateModal = ({ isOpen, onClose, onSelect, fax }) => {
    const { appState } = useAppState();
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
            size="medium"
        >
            <div className="select-template-modal-redesign">
                {/* Header Section - Fixed */}
                <div className="modal-fixed-header">
                    {/* معلومات الفاكس */}
                    {fax && (
                        <div className="context-tag">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z"/>
                            </svg>
                            <span>فاكس #{fax.faxNumber}</span>
                        </div>
                    )}

                    {/* شريط البحث مع عدد النتائج */}
                    {templates.length > 0 && (
                        <div className="search-toolbar">
                            <div className="search-bar-compact">
                                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.35-4.35"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="ابحث عن قالب..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input-compact"
                                />
                                {searchQuery && (
                                    <button 
                                        className="search-clear-btn"
                                        onClick={() => setSearchQuery('')}
                                        aria-label="مسح البحث"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {templates.length > 0 && (
                                <div className="result-count">
                                    {filteredTemplates.length} قالب
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content Area - Scrollable */}
                <div className="modal-scrollable-content">
                    {/* بطاقة المستند الفارغ - Prominent Action */}
                    <div 
                        className="blank-document-card" 
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
                        <div className="blank-doc-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                                <path d="M12 11v6"/>
                                <path d="M9 14h6"/>
                            </svg>
                        </div>
                        <div className="blank-doc-info">
                            <h3>مستند جديد فارغ</h3>
                            <p>إنشاء مستند DOCX من الصفر</p>
                        </div>
                        <div className="blank-doc-arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14"/>
                                <path d="M13 18l6-6"/>
                                <path d="M13 6l6 6"/>
                            </svg>
                        </div>
                    </div>

                    {/* قائمة القوالب */}
                    {templates.length > 0 && (
                        <div className="templates-list-section">
                            <h3 className="templates-section-title">القوالب المحفوظة</h3>
                            
                            {filteredTemplates.length > 0 ? (
                                <div className="templates-grid-compact">
                                    {filteredTemplates.map(template => (
                                        <div
                                            key={template.id}
                                            className="template-card-compact"
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
                                            <div className="template-card-icon">
                                                {getFileIcon(template.fileType)}
                                            </div>
                                            <div className="template-card-content">
                                                <h4>{template.name}</h4>
                                                <span className="file-type-badge">
                                                    {template.fileType?.toUpperCase() || 'DOC'}
                                                </span>
                                            </div>
                                            <div className="template-card-action">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 12h14"/>
                                                    <path d="M13 18l6-6"/>
                                                    <path d="M13 6l6 6"/>
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-compact">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"/>
                                        <path d="m21 21-4.35-4.35"/>
                                    </svg>
                                    <p>لم يتم العثور على قوالب مطابقة</p>
                                </div>
                            )}
                        </div>
                    )}

                    {templates.length === 0 && (
                        <div className="empty-state-info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                            </svg>
                            <p className="empty-title">لا توجد قوالب محفوظة</p>
                            <p className="empty-hint">يمكنك إنشاء مستند فارغ أو إضافة قوالب من قسم القوالب</p>
                        </div>
                    )}
                </div>

                {/* Footer - Fixed */}
                <div className="modal-fixed-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        إلغاء
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SelectTemplateModal;
