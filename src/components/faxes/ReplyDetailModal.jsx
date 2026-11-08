/**
 * ReplyDetailModal Component
 * نافذة تفاصيل الرد على الفاكس
 * Updated document preview and body layout.
 * Header and footer JSX remain unchanged.
 */

import React, { useState } from 'react';

import { useAppState } from '../../context/AppStateContext';

import Modal from '../common/Modal';

import Button from '../common/Button';

import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import ConfirmPrintModal from '../common/ConfirmPrintModal';
import TemplateDetailModal from '../templates/TemplateDetailModal';

import './ReplyDetailModal.css';



const ReplyDetailModal = ({ isOpen, onClose, replyId }) => {

    const { appState, updateState } = useAppState();

    const [isEditingName, setIsEditingName] = useState(false);

    const [editedName, setEditedName] = useState('');

    const [note, setNote] = useState('');

    const [isAddingNote, setIsAddingNote] = useState(false);

    const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
    const [showDeleteReplyModal, setShowDeleteReplyModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    
    // إدارة المرفقات
    const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [showDeleteAttachmentModal, setShowDeleteAttachmentModal] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState(null);
    
    // إدارة مودال تفاصيل القالب
    const [showTemplateDetailModal, setShowTemplateDetailModal] = useState(false);
    const [selectedTemplateForView, setSelectedTemplateForView] = useState(null);



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

    const handleDeleteReply = () => {
        setShowDeleteReplyModal(true);
    };

    const confirmDeleteReply = async () => {
        const updatedReplies = replies.filter(r => r.id !== reply.id);
        await updateState({ faxReplies: updatedReplies });
        setShowDeleteReplyModal(false);
        onClose(); // إغلاق المودال بعد الحذف
    };

    const handlePrint = () => {
        setShowPrintModal(true);
    };

    const confirmPrint = async () => {
        setIsPrinting(true);
        try {
            // سيتم تفعيله لاحقاً مع الباك إند
            console.log('Print reply:', reply.id);
            
            // محاكاة عملية الطباعة
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert(`تم إرسال الرد "${reply.name}" إلى الطابعة`);
            setShowPrintModal(false);
        } catch (error) {
            console.error('Error printing reply:', error);
            alert('حدث خطأ أثناء الطباعة');
        } finally {
            setIsPrinting(false);
        }
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
    
    const handleViewTemplate = () => {
        // البحث عن القالب في القوالب المحفوظة
        const templates = appState.templates || [];
        const template = templates.find(t => t.name === reply.templateName);
        
        if (template) {
            setSelectedTemplateForView(template);
            setShowTemplateDetailModal(true);
        } else {
            // إنشاء كائن قالب مؤقت من معلومات الرد
            const tempTemplate = {
                id: 'temp-' + reply.id,
                name: reply.templateName,
                fileType: reply.fileType || 'DOCX',
                fileName: reply.templateName,
                createdAt: reply.createdAt
            };
            setSelectedTemplateForView(tempTemplate);
            setShowTemplateDetailModal(true);
        }
    };
    
    const handleCloseTemplateModal = () => {
        setShowTemplateDetailModal(false);
        setSelectedTemplateForView(null);
    };
    
    // دوال إدارة المرفقات
    const handlePdfSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newPdfs = files.map((file, index) => ({
                id: Date.now() + index,
                name: file.name,
                size: file.size,
                type: 'pdf',
                file: file,
                preview: URL.createObjectURL(file),
                order: (reply.attachments?.length || 0) + pdfFiles.length + index + 1
            }));
            setPdfFiles(prev => [...prev, ...newPdfs]);
        }
    };

    const handleImagesSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = files.map((file, index) => ({
                id: Date.now() + index,
                name: file.name,
                size: file.size,
                type: 'image',
                file: file,
                preview: URL.createObjectURL(file),
                order: (reply.attachments?.length || 0) + images.length + index + 1
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removePdf = (pdfId) => {
        setPdfFiles(prev => prev.filter(pdf => pdf.id !== pdfId));
    };

    const removeImage = (imageId) => {
        setImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleSaveAttachments = async () => {
        const allNewAttachments = [...pdfFiles, ...images];
        const updatedAttachments = [...(reply.attachments || []), ...allNewAttachments];
        
        const updatedReplies = replies.map(r =>
            r.id === reply.id ? { 
                ...r, 
                attachments: updatedAttachments,
                lastModified: new Date().toISOString() 
            } : r
        );

        await updateState({ faxReplies: updatedReplies });
        setPdfFiles([]);
        setImages([]);
        setShowAttachmentsModal(false);
    };

    const handleDeleteAttachment = async (attachmentId) => {
        const updatedAttachments = (reply.attachments || []).filter(att => att.id !== attachmentId);
        
        const updatedReplies = replies.map(r =>
            r.id === reply.id ? { 
                ...r, 
                attachments: updatedAttachments,
                lastModified: new Date().toISOString() 
            } : r
        );

        await updateState({ faxReplies: updatedReplies });
        setShowDeleteAttachmentModal(false);
        setAttachmentToDelete(null);
    };
    
    const handleDeleteAttachmentClick = (attachment) => {
        setAttachmentToDelete(attachment);
        setShowDeleteAttachmentModal(true);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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

                            <button className="btn-header-icon" onClick={handlePrint} title="طباعة الرد">

                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                                    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"/>

                                    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"/>

                                    <path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4"/>

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

                                            <div className="timeline-content">
                                                <span className="timeline-label">آخر تعديل</span>
                                                <span className="timeline-value">{formatDate(reply.lastModified)}</span>
                                            </div>

                                        </div>

                                    )}

                                </>

                            )}

                        </div>

                    </div>

                }

            >

                <div className="reply-modal-body-refined">
                    <div className="reply-content-scroll reply-content-screenshot">
                        <section className="document-preview-panel" aria-label="معاينة المستند">
                            <div className={`document-status-badge status-${reply.status || 'draft'}`}>
                                <span className="document-status-dot" />
                                {reply.status === 'completed' ? 'مكتمل' : reply.status === 'in_progress' ? 'قيد العمل' : 'مسودة'}
                            </div>
                            <div className="document-paper-preview">
                                <div className="document-paper-heading">DOCUMENT REPLY</div>
                                <span className="document-paper-line line-long" />
                                <span className="document-paper-line line-medium" />
                                <span className="document-paper-line line-short" />
                                <span className="document-paper-gap" />
                                <span className="document-paper-line line-long" />
                                <span className="document-paper-line line-long" />
                                <span className="document-paper-line line-medium" />
                                <span className="document-paper-line line-long" />
                                <span className="document-paper-line line-short" />
                                <span className="document-paper-gap" />
                                <span className="document-paper-line line-long" />
                                <span className="document-paper-line line-medium" />
                                <span className="document-paper-signature" />
                            </div>
                        </section>

                        <section className="document-status-section" aria-label="تغيير حالة الرد">
                            <span className="document-section-caption">تغيير الحالة</span>
                            <div className="document-status-actions">
                                <button className={`document-status-button draft ${reply.status === 'draft' ? 'active' : ''}`} onClick={() => handleStatusChange('draft')}>مسودة</button>
                                <button className={`document-status-button progress ${reply.status === 'in_progress' ? 'active' : ''}`} onClick={() => handleStatusChange('in_progress')}>قيد العمل</button>
                                <button className={`document-status-button completed ${reply.status === 'completed' ? 'active' : ''}`} onClick={() => handleStatusChange('completed')}>مكتمل</button>
                            </div>
                        </section>

                        <section className="document-attachments" aria-label="المرفقات">
                            {fax && (
                                <button type="button" className="document-attachment-card" onClick={handleViewFax}>
                                    <span className="document-attachment-thumb">
                                        <span className="document-mini-paper">
                                            <b>FAX</b>
                                            <i className="mini-line wide" /><i className="mini-line medium" /><i className="mini-line wide" /><i className="mini-line short" />
                                            <i className="mini-line wide lower" /><i className="mini-line medium" /><i className="mini-line wide" />
                                        </span>
                                    </span>
                                    <strong>{fax.name}</strong>
                                    <small>الفاكس المرتبط</small>
                                </button>
                            )}
                            {reply.templateName && (
                                <button type="button" className="document-attachment-card" onClick={handleViewTemplate}>
                                    <span className="document-attachment-thumb">
                                        <span className="document-mini-paper">
                                            <b>TEMPLATE</b>
                                            <i className="mini-line wide" /><i className="mini-line short" />
                                            <i className="mini-line wide lower" /><i className="mini-line wide" /><i className="mini-line medium" />
                                        </span>
                                    </span>
                                    <strong>{reply.templateName}</strong>
                                    <small>القالب المستخدم</small>
                                </button>
                            )}
                        </section>

                        {/* قسم المرفقات الإضافية */}
                        <section className="document-user-attachments" aria-label="المرفقات الإضافية">
                            <div className="document-section-header">
                                <span className="document-section-caption">المرفقات</span>
                                <button 
                                    type="button" 
                                    className="btn-add-attachment"
                                    onClick={() => setShowAttachmentsModal(true)}
                                >
                                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1"/>
                                    </svg>
                                    إضافة ملفات
                                </button>
                            </div>
                            
                            {reply.attachments && reply.attachments.length > 0 ? (
                                <div className="attachments-list">
                                    {reply.attachments.map((attachment) => (
                                        <div key={attachment.id} className="attachment-item">
                                            <div className="attachment-preview">
                                                {attachment.type === 'image' ? (
                                                    <img src={attachment.preview || attachment.url} alt={attachment.name} />
                                                ) : (
                                                    <div className="attachment-icon">
                                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                                            <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="attachment-info">
                                                <h4>{attachment.name}</h4>
                                                <p>{attachment.size ? formatFileSize(attachment.size) : 'ملف'}</p>
                                            </div>
                                            <button 
                                                className="btn-delete-attachment"
                                                onClick={() => handleDeleteAttachmentClick(attachment)}
                                                title="حذف المرفق"
                                            >
                                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-attachments">
                                    <svg className="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"/>
                                        <path d="M9 15l3 -3l3 3"/>
                                        <path d="M12 12l0 9"/>
                                    </svg>
                                    <p>لا توجد مرفقات إضافية</p>
                                </div>
                            )}
                        </section>

                        <section className="document-notes-card">
                            <div className="document-notes-heading">
                                <strong>الملاحظات</strong>
                                {reply.note && !isAddingNote && (
                                    <div className="document-note-actions">
                                        <button type="button" onClick={handleEditNote}>تعديل</button>
                                        <button type="button" className="danger" onClick={handleDeleteNote}>حذف</button>
                                    </div>
                                )}
                            </div>
                            {reply.note && !isAddingNote ? (
                                <p className="document-note-content">{reply.note}</p>
                            ) : isAddingNote ? (
                                <div className="note-edit-redesign">
                                    <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="اكتب ملاحظة..." className="note-textarea-redesign" autoFocus rows="3" />
                                    <div className="note-edit-actions">
                                        <Button variant="primary" size="sm" onClick={handleAddNote}>{reply.note ? 'حفظ' : 'إضافة'}</Button>
                                        <Button variant="secondary" size="sm" onClick={() => { setIsAddingNote(false); setNote(''); }}>إلغاء</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="document-note-empty-row">
                                    <span>لا توجد ملاحظات</span>
                                    <button type="button" onClick={() => setIsAddingNote(true)}>إضافة ملاحظة</button>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="reply-footer-refined">

                        <Button variant="primary" onClick={handleOpenFile}>

                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>

                                <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>

                            </svg>

                            فتح الملف

                        </Button>

                        <Button variant="danger" onClick={handleDeleteReply}>

                            <svg viewBox="0 0 24 24" fill="currentColor">

                                <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z"/>

                                <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z"/>

                            </svg>

                            حذف الرد

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
            
            {/* مودال تأكيد حذف الرد */}
            <ConfirmDeleteModal
                isOpen={showDeleteReplyModal}
                onClose={() => setShowDeleteReplyModal(false)}
                onConfirm={confirmDeleteReply}
                title="تأكيد حذف الرد"
                message="هل أنت متأكد من حذف هذا الرد نهائياً؟"
                itemName={reply?.name}
                warningNote="سيتم حذف الرد وجميع محتوياته (ملاحظات، مرفقات) ولا يمكن التراجع عن هذا الإجراء"
                loading={false}
            />
            
            {/* مودال تأكيد الطباعة */}
            <ConfirmPrintModal
                isOpen={showPrintModal}
                onClose={() => setShowPrintModal(false)}
                onConfirm={confirmPrint}
                title="تأكيد طباعة الرد"
                message="هل تريد طباعة هذا الرد؟"
                itemName={reply?.name}
                pagesCount="مستند رد على الفاكس"
                loading={isPrinting}
            />
            
            {/* مودال تأكيد حذف المرفق */}
            <ConfirmDeleteModal
                isOpen={showDeleteAttachmentModal}
                onClose={() => {
                    setShowDeleteAttachmentModal(false);
                    setAttachmentToDelete(null);
                }}
                onConfirm={() => handleDeleteAttachment(attachmentToDelete?.id)}
                title="تأكيد حذف المرفق"
                message="هل أنت متأكد من حذف هذا المرفق؟"
                itemName={attachmentToDelete?.name}
                warningNote="لا يمكن التراجع عن هذا الإجراء"
                loading={false}
            />
            
            {/* مودال إضافة المرفقات */}
            {showAttachmentsModal && (
                <Modal
                    isOpen={showAttachmentsModal}
                    onClose={() => {
                        setShowAttachmentsModal(false);
                        setPdfFiles([]);
                        setImages([]);
                    }}
                    title="إضافة مرفقات"
                    size="medium"
                >
                    <div className="attachments-upload-modal">
                        {/* قسم رفع ملفات PDF */}
                        <div className="upload-section">
                            <h3 className="upload-section-title">
                                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor" style={{color: '#ef4444'}}>
                                    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                                </svg>
                                ملفات PDF
                            </h3>
                            <div className="upload-area">
                                <input 
                                    type="file" 
                                    id="pdfAttachmentInput" 
                                    accept=".pdf" 
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={handlePdfSelect}
                                />
                                {pdfFiles.length === 0 ? (
                                    <div 
                                        className="upload-placeholder" 
                                        onClick={() => document.getElementById('pdfAttachmentInput').click()}
                                    >
                                        <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"/>
                                            <path d="M9 15l3 -3l3 3"/>
                                            <path d="M12 12l0 9"/>
                                        </svg>
                                        <p>انقر لاختيار ملفات PDF</p>
                                        <small>يمكنك اختيار ملف واحد أو عدة ملفات PDF</small>
                                    </div>
                                ) : (
                                    <>
                                        <div className="upload-preview">
                                            {pdfFiles.map((pdf) => (
                                                <div key={pdf.id} className="preview-file">
                                                    <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor" style={{color: '#ef4444'}}>
                                                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                                                    </svg>
                                                    <div className="preview-file-info">
                                                        <h4>{pdf.name}</h4>
                                                        <small>{formatFileSize(pdf.size)}</small>
                                                    </div>
                                                    <button className="btn-icon-small" type="button" onClick={() => removePdf(pdf.id)}>
                                                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            className="btn-add-more" 
                                            onClick={() => document.getElementById('pdfAttachmentInput').click()}
                                        >
                                            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 5l0 14"/>
                                                <path d="M5 12l14 0"/>
                                            </svg>
                                            إضافة المزيد من ملفات PDF
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* قسم رفع الصور */}
                        <div className="upload-section">
                            <h3 className="upload-section-title">
                                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor" style={{color: '#10b981'}}>
                                    <path d="M15 8h.01"/>
                                    <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z"/>
                                    <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"/>
                                    <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"/>
                                </svg>
                                صور
                            </h3>
                            <div className="upload-area">
                                <input 
                                    type="file" 
                                    id="imagesAttachmentInput" 
                                    accept="image/*" 
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={handleImagesSelect}
                                />
                                {images.length === 0 ? (
                                    <div 
                                        className="upload-placeholder" 
                                        onClick={() => document.getElementById('imagesAttachmentInput').click()}
                                    >
                                        <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"/>
                                            <path d="M9 15l3 -3l3 3"/>
                                            <path d="M12 12l0 9"/>
                                        </svg>
                                        <p>انقر لاختيار صور</p>
                                        <small>يمكنك اختيار صورة واحدة أو عدة صور</small>
                                    </div>
                                ) : (
                                    <>
                                        <div className="upload-preview images-grid">
                                            {images.map((img) => (
                                                <div key={img.id} className="image-preview-item">
                                                    <img src={img.preview} alt={img.name} />
                                                    <button className="remove-image-btn" onClick={() => removeImage(img.id)}>
                                                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            className="btn-add-more" 
                                            onClick={() => document.getElementById('imagesAttachmentInput').click()}
                                        >
                                            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 5l0 14"/>
                                                <path d="M5 12l14 0"/>
                                            </svg>
                                            إضافة المزيد من الصور
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn-secondary" 
                                onClick={() => {
                                    setShowAttachmentsModal(false);
                                    setPdfFiles([]);
                                    setImages([]);
                                }}
                            >
                                إلغاء
                            </button>
                            <button 
                                type="button" 
                                className="btn-success" 
                                onClick={handleSaveAttachments}
                                disabled={pdfFiles.length === 0 && images.length === 0}
                            >
                                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M5 12l5 5l10 -10"/>
                                </svg>
                                حفظ المرفقات
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* مودال تفاصيل القالب */}
            {showTemplateDetailModal && selectedTemplateForView && (
                <TemplateDetailModal
                    isOpen={showTemplateDetailModal}
                    onClose={handleCloseTemplateModal}
                    template={selectedTemplateForView}
                    onUseTemplate={() => {
                        console.log('استخدام القالب من مودال تفاصيل الرد');
                        handleCloseTemplateModal();
                    }}
                    onDownloadTemplate={() => {
                        console.log('تنزيل القالب من مودال تفاصيل الرد');
                    }}
                />
            )}

        </>

    );

};



export default ReplyDetailModal;