/**
 * ReminderDetailModal Component
 * مودال تفاصيل التذكير - Modern Redesign
 * Matches exact reference design specifications
 */

import React, { useState, useEffect } from 'react';
import { dataAPI } from '../../services/electronAPI';
import FaxDetailModal from '../faxes/FaxDetailModal';

const ReminderDetailModal = ({ reminder, onClose, onEdit, onDelete, onToggle }) => {
    const [linkedFax, setLinkedFax] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showFaxModal, setShowFaxModal] = useState(false);
    const [attachments, setAttachments] = useState(reminder.attachments || []);
    const [showDeleteAttachmentConfirm, setShowDeleteAttachmentConfirm] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState(null);

    useEffect(() => {
        if (reminder.linkedFaxId) {
            loadLinkedFax();
        }
    }, [reminder.linkedFaxId]);

    useEffect(() => {
        setAttachments(reminder.attachments || []);
    }, [reminder.attachments]);

    const loadLinkedFax = async () => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data && result.data.filteredFaxes) {
                const fax = result.data.filteredFaxes.find(f => f.id === reminder.linkedFaxId);
                setLinkedFax(fax);
            }
        } catch (error) {
            console.error('Error loading linked fax:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleDownloadAttachment = (attachment) => {
        const link = document.createElement('a');
        link.href = attachment.data;
        link.download = attachment.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeleteAttachmentClick = (attachment) => {
        setAttachmentToDelete(attachment);
        setShowDeleteAttachmentConfirm(true);
    };

    const handleConfirmDeleteAttachment = async () => {
        if (!attachmentToDelete) return;

        try {
            // حذف المرفق من القائمة
            const updatedAttachments = attachments.filter(att => att.id !== attachmentToDelete.id);
            setAttachments(updatedAttachments);

            // تحديث البيانات في الملف
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedReminders = result.data.reminders.map(r => {
                    if (r.id === reminder.id) {
                        return { ...r, attachments: updatedAttachments };
                    }
                    return r;
                });

                await dataAPI.saveData({
                    ...result.data,
                    reminders: updatedReminders
                });
            }

            // إغلاق المودال وإعادة تعيين الحالة
            setShowDeleteAttachmentConfirm(false);
            setAttachmentToDelete(null);
        } catch (error) {
            console.error('Error deleting attachment:', error);
        }
    };

    const handleCancelDeleteAttachment = () => {
        setShowDeleteAttachmentConfirm(false);
        setAttachmentToDelete(null);
    };

    const handleAddAttachment = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.pdf,.doc,.docx,.txt';
        input.multiple = true;
        
        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            try {
                const newAttachments = await Promise.all(
                    files.map(file => {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                resolve({
                                    id: Date.now() + Math.random(),
                                    name: file.name,
                                    size: file.size,
                                    type: file.type,
                                    data: event.target.result
                                });
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        });
                    })
                );

                const updatedAttachments = [...attachments, ...newAttachments];
                setAttachments(updatedAttachments);

                // حفظ التحديث
                const result = await dataAPI.loadData();
                if (result.success && result.data) {
                    const updatedReminders = result.data.reminders.map(r => {
                        if (r.id === reminder.id) {
                            return { ...r, attachments: updatedAttachments };
                        }
                        return r;
                    });

                    await dataAPI.saveData({
                        ...result.data,
                        reminders: updatedReminders
                    });
                }
            } catch (error) {
                console.error('Error adding attachments:', error);
            }
        };

        input.click();
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteConfirm(false);
        onDelete();
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const isActive = reminder.isActive !== undefined ? reminder.isActive : true;
    const statusText = !isActive ? 'متوقف' : reminder.isExpired ? 'منتهي' : 'نشط';

    return (
        <div className="reminder-detail-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <section className="reminder-detail-modal" role="dialog" aria-modal="true">
                {/* Header */}
                <header className="reminder-modal-header">
                    <div className="modal-head">
                        <div className="modal-head-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm7-5-1.5-2V10a5.5 5.5 0 0 0-4.5-5.4V4a1 1 0 0 0-2 0v.6A5.5 5.5 0 0 0 6.5 10v5L5 17v1h14Z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="modal-main-title">تفاصيل التذكير</h1>
                            <div className="modal-subhead">عرض تفاصيل التذكير والفاكس المرتبط به</div>
                        </div>
                    </div>
                    <div className="modal-head-actions">
                        <button 
                            className="modal-icon-btn" 
                            onClick={onEdit}
                            title="تعديل"
                            aria-label="تعديل"
                        >
                            ✎
                        </button>
                        <button 
                            className="modal-icon-btn" 
                            onClick={onClose}
                            title="إغلاق"
                            aria-label="إغلاق"
                        >
                            ×
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="reminder-modal-main">
                    {/* Summary Card */}
                    <div className="reminder-summary-card">
                        <div className="summary-bell-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm7-5-1.5-2V10a5.5 5.5 0 0 0-11 0v5L5 17v1h14Z"/>
                            </svg>
                        </div>
                        <div className="summary-copy">
                            <div className="summary-eyebrow">عنوان التذكير</div>
                            <h2 className="summary-title">{reminder.title}</h2>
                            {reminder.description && (
                                <div className="summary-description">{reminder.description}</div>
                            )}
                        </div>
                        <span className={`reminder-status-badge ${!isActive ? 'paused' : reminder.isExpired ? 'expired' : 'active'}`}>
                            {statusText}
                        </span>
                    </div>

                    {/* Dates Section */}
                    <section className="reminder-section">
                        <div className="reminder-section-head">
                            <h3>مواعيد التذكير</h3>
                            <span className="section-hint">الفترة المحددة للمتابعة</span>
                        </div>
                        <div className="reminder-dates-grid">
                            <div className="reminder-date-card">
                                <div className="reminder-date-icon">▦</div>
                                <div>
                                    <div className="reminder-date-label">تاريخ البدء</div>
                                    <div className="reminder-date-value">{formatDate(reminder.startDate)}</div>
                                </div>
                            </div>
                            <div className="reminder-date-card">
                                <div className="reminder-date-icon">◷</div>
                                <div>
                                    <div className="reminder-date-label">تاريخ الانتهاء</div>
                                    <div className="reminder-date-value">{formatDate(reminder.endDate)}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Linked Fax */}
                    {linkedFax && (
                        <section className="reminder-section">
                            <div className="reminder-section-head">
                                <h3>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="3" y="5" width="18" height="14" rx="2"/>
                                    </svg>
                                    الفاكس المرتبط
                                </h3>
                                <span className="section-hint">فاكس واحد مرتبط بهذا التذكير</span>
                            </div>
                            <div className="reminder-linked-fax">
                                <div className="linked-fax-paper">
                                    <b>FAX {linkedFax.faxNumber}</b>
                                    <i></i>
                                    <i></i>
                                    <i></i>
                                </div>
                                <div className="linked-fax-copy">
                                    <div className="linked-fax-title">
                                        فاكس {linkedFax.faxNumber}
                                        <span className="fax-tag">فاكس مفلتر</span>
                                    </div>
                                    <div className="linked-fax-meta">
                                        عدد الصفحات: {linkedFax.pageIds?.length || 0} صفحة أساسية
                                        {linkedFax.dependentPageIds?.length > 0 && 
                                            ` + ${linkedFax.dependentPageIds.length} صفحة تابعة`
                                        }
                                        <br/>
                                        تاريخ الإضافة: {formatDate(linkedFax.createdDate || new Date())}
                                    </div>
                                </div>
                                <button 
                                    className="reminder-view-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowFaxModal(true);
                                    }}
                                >
                                    ◎ عرض الفاكس
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Attachments */}
                    <section className="reminder-section">
                        <div className="reminder-section-head">
                            <h3>📎 المرفقات <span className="section-hint">({attachments.length})</span></h3>
                            <button className="reminder-add-file-btn" onClick={handleAddAttachment}>
                                + إضافة مرفق
                            </button>
                        </div>
                        <div className="reminder-files-grid">
                            {attachments.length > 0 ? (
                                <>
                                    {attachments.map(attachment => (
                                        <article key={attachment.id} className="reminder-file-card">
                                            <div className="reminder-file-preview">
                                                {attachment.type.startsWith('image/') ? (
                                                    <img src={attachment.data} alt={attachment.name} />
                                                ) : (
                                                    <div className="reminder-file-icon-placeholder">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                <button 
                                                    className="reminder-download-btn"
                                                    onClick={() => handleDownloadAttachment(attachment)}
                                                    title="تحميل"
                                                >
                                                    ↓
                                                </button>
                                                <button 
                                                    className="reminder-delete-attachment-btn"
                                                    onClick={() => handleDeleteAttachmentClick(attachment)}
                                                    title="حذف المرفق"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="reminder-file-info">
                                                <div className="reminder-filename">{attachment.name}</div>
                                                <div className="reminder-filesize">{formatFileSize(attachment.size)}</div>
                                            </div>
                                        </article>
                                    ))}
                                    <div className="reminder-file-placeholder" onClick={handleAddAttachment}>
                                        يمكنك إرفاق ملفات إضافية بهذا التذكير
                                    </div>
                                </>
                            ) : (
                                <div 
                                    className="reminder-file-placeholder reminder-file-placeholder-full"
                                    onClick={handleAddAttachment}
                                    style={{ cursor: 'pointer' }}
                                >
                                    يمكنك إرفاق ملفات بهذا التذكير
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="reminder-modal-footer">
                    <button 
                        className="reminder-btn-close" 
                        onClick={onClose}
                    >
                        إغلاق
                    </button>
                    <button 
                        className="reminder-btn-delete" 
                        onClick={handleDeleteClick}
                    >
                        حذف التذكير　♲
                    </button>
                </footer>
            </section>

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="reminder-confirm-overlay" onClick={handleCancelDelete}>
                    <div className="reminder-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="reminder-confirm-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.8"/>
                                <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h3 className="reminder-confirm-title">تأكيد حذف التذكير</h3>
                        <p className="reminder-confirm-message">
                            هل أنت متأكد من حذف التذكير <strong>"{reminder.title}"</strong>؟
                            <br/>
                            <span className="reminder-confirm-warning">لا يمكن التراجع عن هذا الإجراء</span>
                        </p>
                        <div className="reminder-confirm-actions">
                            <button 
                                className="reminder-confirm-cancel" 
                                onClick={handleCancelDelete}
                            >
                                إلغاء
                            </button>
                            <button 
                                className="reminder-confirm-delete" 
                                onClick={handleConfirmDelete}
                            >
                                ♲ نعم، احذف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Attachment Confirmation */}
            {showDeleteAttachmentConfirm && attachmentToDelete && (
                <div className="reminder-confirm-overlay" onClick={handleCancelDeleteAttachment}>
                    <div className="reminder-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="reminder-confirm-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="reminder-confirm-title">تأكيد حذف المرفق</h3>
                        <p className="reminder-confirm-message">
                            هل أنت متأكد من حذف المرفق؟
                            <br/>
                            <strong>"{attachmentToDelete.name}"</strong>
                            <br/>
                            <span className="reminder-confirm-warning">لا يمكن التراجع عن هذا الإجراء</span>
                        </p>
                        <div className="reminder-confirm-actions">
                            <button 
                                className="reminder-confirm-cancel" 
                                onClick={handleCancelDeleteAttachment}
                            >
                                إلغاء
                            </button>
                            <button 
                                className="reminder-confirm-delete" 
                                onClick={handleConfirmDeleteAttachment}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                نعم، احذف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fax Modal */}
            {showFaxModal && linkedFax && (
                <FaxDetailModal 
                    isOpen={showFaxModal}
                    faxId={linkedFax.id}
                    onClose={() => setShowFaxModal(false)}
                    onAddToLists={() => {}}
                    onDelete={() => {}}
                />
            )}
        </div>
    );
};

export default ReminderDetailModal;
