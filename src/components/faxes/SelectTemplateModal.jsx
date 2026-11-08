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
import TemplateDetailModal from '../templates/TemplateDetailModal';
import './SelectModals.css';

const SelectTemplateModal = ({ isOpen, onClose, onSelect, fax }) => {
    const { appState } = useAppState();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [viewingTemplate, setViewingTemplate] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // الحصول على القوالب من النظام
    const templates = appState.templates || [];

    // تصفية القوالب حسب البحث
    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        // تأخير صغير قبل إغلاق المودال للسماح برؤية التحديد
        setTimeout(() => {
            onSelect(template);
        }, 200);
    };

    const handlePreviewClick = (e, template) => {
        e.stopPropagation(); // منع تفعيل onClick الخاص بالكارت
        setViewingTemplate(template);
        setIsDetailModalOpen(true);
    };

    const handleSelectFromDetail = (template) => {
        setIsDetailModalOpen(false);
        setSelectedTemplate(template);
        // تأخير صغير قبل إغلاق المودال للسماح برؤية التحديد
        setTimeout(() => {
            onSelect(template);
        }, 200);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setViewingTemplate(null);
    };

    const handleCreateBlank = () => {
        onSelect(null); // null يعني مستند فارغ
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
                        <div className="saved-templates-section">
                            <div className="saved-templates-heading">
                                <span>القوالب المحفوظة</span>
                                <span className="templates-count">{filteredTemplates.length} قالب</span>
                            </div>
                            
                            {filteredTemplates.length > 0 ? (
                                <div className="saved-templates-grid">
                                    {filteredTemplates.map(template => (
                                        <div
                                            key={template.id}
                                            className={`saved-template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                                            onClick={() => handleTemplateSelect(template)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleTemplateSelect(template);
                                                }
                                            }}
                                        >
                                            <div className="template-thumbnail">
                                                <div className="mini-document">
                                                    <div className="mini-doc-heading"></div>
                                                    <div className="mini-doc-line"></div>
                                                    <div className="mini-doc-line"></div>
                                                    <div className="mini-doc-line"></div>
                                                    <div className="mini-doc-table"></div>
                                                    <div className="mini-doc-line"></div>
                                                    <div className="mini-doc-line short"></div>
                                                </div>
                                            </div>
                                            <div className="saved-template-info">
                                                <strong>{template.name}</strong>
                                                <span>{template.fileType?.toUpperCase() || 'DOCX'}</span>
                                            </div>
                                            <button 
                                                className="template-preview-btn"
                                                onClick={(e) => handlePreviewClick(e, template)}
                                                title="معاينة القالب"
                                                aria-label="معاينة القالب"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316-.105-.316C21.927 11.617 19.633 5 12 5z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            </button>
                                            <div className="template-selected-indicator"></div>
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

            {/* مودال تفاصيل القالب */}
            {isDetailModalOpen && viewingTemplate && (
                <TemplateDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                    template={viewingTemplate}
                    onUseTemplate={handleSelectFromDetail}
                />
            )}
        </Modal>
    );
};

export default SelectTemplateModal;
