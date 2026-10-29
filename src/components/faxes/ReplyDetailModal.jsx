/**
 * ReplyDetailModal Component - Redesigned
 * نافذة تفاصيل الرد على الفاكس
 * 
 * UX Improvements:
 * - Compact document identity (not huge placeholder icon)
 * - Unified metadata sections with consistent styling
 * - Fixed header, scrollable content, fixed footer
 * - Balanced layout proportions
 * - Improved visual hierarchy
 * - Content-responsive sizing
 */

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import './ReplyDetailModal.css';

const ReplyDetailModal = ({ isOpen, onClose, replyId }) => {
    const { appState, updateState } = useAppState();
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [note, setNote] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);

    const replies = appState.faxReplies || [];
    const filteredFaxes = appState.filteredFaxes || [];
    
    const reply = replies.find(r => r.id === replyId);
    const fax = reply ? filteredFaxes.find(f => f.id === reply.faxId) : null;

    if (!reply) return null;

    // تنسيق التاريخ
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // أيقونة نوع الملف
    const getFileTypeIcon = () => {
        switch (reply.fileType?.toLowerCase()) {
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

    const handleStartEditName = () => {
        setEditedName(reply.name);
        setIsEditingName(true);
    };

    const handleSaveName = async () => {
        if (!editedName.trim()) return;

        const updatedReplies = replies.map(r =>
            r.id === reply.id ? { ...r, name: editedName.trim(), lastModified: new Date().toISOString() } : r
        );

        await updateState({ faxReplies: updatedReplies });
        setIsEditingName(false);
    };

    const handleCancelEditName = () => {
        setIsEditingName(false);
        setEditedName('');
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;

        const updatedReplies = replies.map(r =>
            r.id === reply.id ? { ...r, note: note.trim(), lastModified: new Date().toISOString() } : r
        );

        await updateState({ faxReplies: updatedReplies });
        setNote('');
        setIsAddingNote(false);
    };

    const handleEditNote = () => {
        setNote(reply.note);
        setIsAddingNote(true);
    };

    const handleDeleteNote = () => {
        setShowDeleteNoteModal(true);
    };

    const confirmDeleteNote = async () => {
        const updatedReplies = replies.map(r =>
            r.id === reply.id ? { ...r, note: '', lastModified: new Date().toISOString() } : r
        );

        await updateState({ faxReplies: updatedReplies });
        setShowDeleteNoteModal(false);
    };

    const handleStatusChange = async (newStatus) => {
        const updatedReplies = replies.map(r =>
            r.id === reply.id ? { ...r, status: newStatus, lastModified: new Date().toISOString() } : r
        );

        await updateState({ faxReplies: updatedReplies });
    };

    const handleOpenFile = () => {
        console.log('Open reply file:', reply.id);
        alert('سيتم فتح الملف في المرحلة النهائية');
    };

    const handleOpenFolder = () => {
        console.log('Open reply folder:', reply.id);
        alert('سيتم فتح المجلد في المرحلة النهائية');
    };

    const handleViewFax = () => {
        console.log('View related fax:', reply.faxId);
        alert('سيتم فتح تفاصيل الفاكس المرتبط');
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={null}
                size="medium"
                customHeader={
                    <div className="reply-header-exact">
                        {/* Left Side - Action Buttons */}
                        <div className="reply-header-left-actions">
                            <button className="btn-header-icon" onClick={onClose} title="إغلاق">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            <button className="btn-header-icon" onClick={handleOpenFolder} title="فتح المجلد">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"/>
                                </svg>
                            </button>
                            <button className="btn-header-icon" onClick={handleStartEditName} title="تعديل">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/>
                                    <path d="M13.5 6.5l4 4"/>
                                </svg>
                            </button>
                        </div>

                        {/* Right Side - Title and Metadata */}
                        <div className="reply-header-right-content">
                            {isEditingName ? (
                                <div className="reply-header-edit-mode">
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="reply-name-input-exact"
                                        autoFocus
                                        onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                                    />
                                    <button className="btn-header-icon success" onClick={handleSaveName} title="حفظ">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </button>
                                    <button className="btn-header-icon" onClick={handleCancelEditName} title="إلغاء">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="reply-header-title-row">
                                        <h2 className="reply-title-exact">رد - {reply.name}</h2>
                                    </div>
                                    {fax && (
                                        <div className="reply-header-subtitle">
                                            <span className="file-type-badge-exact">{reply.fileType?.toUpperCase() || 'DOCX'}</span>
                                            فاكس #{fax.faxNumber} — فاكس {fax.faxNumber}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                }
            >
                <div className="reply-modal-body-refined">
                    {/* Scrollable Content */}
                    <div className="reply-content-scroll">
                        {/* Linked Document - Compact */}
                        <div className="metadata-row">
                            <label className="metadata-label">المستند المرتبط</label>
                            {fax ? (
                                <button className="linked-fax-btn" onClick={handleViewFax}>
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z"/>
                                    </svg>
                                    <span className="fax-num">الفاكس #{fax.faxNumber}</span>
                                    —
                                    <span className="fax-title">{fax.name}</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow-icon">
                                        <path d="M5 12h14"/>
                                        <path d="M13 18l6-6"/>
                                        <path d="M13 6l6 6"/>
                                    </svg>
                                </button>
                            ) : (
                                <span className="metadata-value-empty">—</span>
                            )}
                        </div>

                        {/* Template Info */}
                        {reply.templateName && (
                            <div className="metadata-row">
                                <label className="metadata-label">القالب المستخدم</label>
                                <div className="template-info-compact">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2"/>
                                        <rect x="9" y="3" width="6" height="4" rx="2"/>
                                    </svg>
                                    <span>{reply.templateName}</span>
                                </div>
                            </div>
                        )}

                        {/* Status Selector */}
                        <div className="metadata-section">
                            <label className="section-label">حالة الرد</label>
                            <div className="status-selector-redesign">
                                <button 
                                    className={`status-btn ${reply.status === 'draft' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange('draft')}
                                >
                                    <span className="status-indicator status-draft"></span>
                                    مسودة
                                </button>
                                <button 
                                    className={`status-btn ${reply.status === 'in_progress' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange('in_progress')}
                                >
                                    <span className="status-indicator status-in-progress"></span>
                                    قيد العمل
                                </button>
                                <button 
                                    className={`status-btn ${reply.status === 'completed' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange('completed')}
                                >
                                    <span className="status-indicator status-completed"></span>
                                    مكتمل
                                </button>
                            </div>
                        </div>

                        {/* Activity Timeline - Compact */}
                        <div className="metadata-section">
                            <label className="section-label">سجل المستند</label>
                            <div className="activity-timeline">
                                <div className="timeline-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4"/>
                                        <circle cx="18" cy="18" r="4"/>
                                        <path d="M15 3v4"/>
                                        <path d="M7 3v4"/>
                                        <path d="M3 11h16"/>
                                        <path d="M18 16.496v1.504l1 1"/>
                                    </svg>
                                    <div className="timeline-content">
                                        <span className="timeline-label">تاريخ الإنشاء</span>
                                        <span className="timeline-value">{formatDate(reply.createdDate)}</span>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l.324 .001l.318 .004l.616 .017l.299 .013l.579 .034l.553 .046c4.785 .464 6.732 2.411 7.196 7.196l.046 .553l.034 .579c.005 .098 .01 .198 .013 .299l.017 .616l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.464 4.785 -2.411 6.732 -7.196 7.196l-.553 .046l-.579 .034c-.098 .005 -.198 .01 -.299 .013l-.616 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.785 -.464 -6.732 -2.411 -7.196 -7.196l-.046 -.553l-.034 -.579a28.058 28.058 0 0 1 -.013 -.299l-.017 -.616c-.003 -.21 -.005 -.424 -.005 -.642l.001 -.324l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.464 -4.785 2.411 -6.732 7.196 -7.196l.553 -.046l.579 -.034c.098 -.005 .198 -.01 .299 -.013l.616 -.017c.21 -.003 .424 -.005 .642 -.005zm0 5a1 1 0 0 0 -.993 .883l-.007 .117v5l.009 .131a1 1 0 0 0 .197 .477l.087 .1l3 3l.094 .082a1 1 0 0 0 1.226 0l.094 -.083l.083 -.094a1 1 0 0 0 0 -1.226l-.083 -.094l-2.293 -2.293v-4.586l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
                                    </svg>
                                    <div className="timeline-content">
                                        <span className="timeline-label">آخر تعديل</span>
                                        <span className="timeline-value">{formatDate(reply.lastModified)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="metadata-section">
                            <label className="section-label">الملاحظات</label>
                            {reply.note && !isAddingNote ? (
                                <div className="note-display-redesign">
                                    <p className="note-text">{reply.note}</p>
                                    <div className="note-actions-redesign">
                                        <button className="btn-note-action" onClick={handleEditNote}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/>
                                                <path d="M13.5 6.5l4 4"/>
                                            </svg>
                                            تعديل
                                        </button>
                                        <button className="btn-note-action danger" onClick={handleDeleteNote}>
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                                            </svg>
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            ) : isAddingNote ? (
                                <div className="note-edit-redesign">
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="اكتب ملاحظة..."
                                        className="note-textarea-redesign"
                                        autoFocus
                                        rows="3"
                                    />
                                    <div className="note-edit-actions">
                                        <Button variant="primary" size="sm" onClick={handleAddNote}>
                                            {reply.note ? 'حفظ' : 'إضافة'}
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={() => { setIsAddingNote(false); setNote(''); }}>
                                            إلغاء
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <button className="btn-add-note-redesign" onClick={() => setIsAddingNote(true)}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 5l0 14"/>
                                        <path d="M5 12l14 0"/>
                                    </svg>
                                    إضافة ملاحظة
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="reply-footer-refined">
                        <Button variant="primary" onClick={handleOpenFile}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                            </svg>
                            فتح الملف
                        </Button>
                        <Button variant="secondary" onClick={onClose}>
                            إغلاق
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmDeleteModal
                isOpen={showDeleteNoteModal}
                onClose={() => setShowDeleteNoteModal(false)}
                onConfirm={confirmDeleteNote}
                title="تأكيد حذف الملاحظة"
                message="هل أنت متأكد من حذف الملاحظة؟"
                warningNote="لا يمكن التراجع عن هذا الإجراء"
                loading={false}
            />
        </>
    );
};

export default ReplyDetailModal;
