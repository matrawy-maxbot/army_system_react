/**
 * FaxRepliesSection Component
 * قسم الردود على الفاكسات - عرض وإدارة الردود على الفاكسات المفلترة
 */

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useToast } from '../common/ToastContainer';
import './FaxReplies.css';
import SelectFaxModal from './SelectFaxModal';
import SelectTemplateModal from './SelectTemplateModal';
import ReplyCard from './ReplyCard';
import ReplyDetailModal from './ReplyDetailModal';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';

const FaxRepliesSection = () => {
    const { appState, updateState } = useAppState();
    const toast = useToast();
    const [tempSelectedFaxId, setTempSelectedFaxId] = useState(null);
    const [showSelectFaxModal, setShowSelectFaxModal] = useState(false);
    const [showSelectTemplateModal, setShowSelectTemplateModal] = useState(false);
    const [showReplyDetail, setShowReplyDetail] = useState(false);
    const [selectedReplyId, setSelectedReplyId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [replyToDelete, setReplyToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedReplies, setSelectedReplies] = useState(new Set());
    const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);

    const filteredFaxes = appState.filteredFaxes || [];
    const replies = appState.faxReplies || [];

    // الحصول على جميع الردود مع معلومات الفاكس المرتبط
    const allReplies = replies.map(reply => {
        const fax = filteredFaxes.find(f => f.id === reply.faxId);
        return {
            ...reply,
            faxName: fax?.name || 'فاكس محذوف',
            faxNumber: fax?.faxNumber || '?'
        };
    });

    const handleAddReply = () => {
        // دائماً نفتح مودال اختيار الفاكس أولاً عند إضافة رد جديد
        setShowSelectFaxModal(true);
    };

    const handleFaxSelected = (faxId) => {
        setTempSelectedFaxId(faxId);
        setShowSelectFaxModal(false);
        setShowSelectTemplateModal(true);
    };

    const handleTemplateSelected = async (template) => {
        if (!tempSelectedFaxId) return;

        const selectedFax = filteredFaxes.find(f => f.id === tempSelectedFaxId);

        // إنشاء رد جديد
        const newReply = {
            id: `reply-${Date.now()}`,
            faxId: tempSelectedFaxId,
            name: template ? `رد - ${template.name}` : 'مستند فارغ',
            templateId: template?.id || null,
            templateName: template?.name || null,
            fileType: template?.fileType || 'docx',
            status: 'draft', // draft, in_progress, completed
            createdDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            note: '',
            isCreatedFromTemplate: template ? true : false,
            createdFromTemplateId: template?.id || null,
            createdFromTemplateName: template?.name || null
        };

        const updatedReplies = [...replies, newReply];
        await updateState({ faxReplies: updatedReplies });

        setShowSelectTemplateModal(false);
        setTempSelectedFaxId(null);

        // في المرحلة النهائية، سيتم فتح الملف هنا
        console.log('Reply created:', newReply);
        
        // عرض toast احترافي
        toast.success(
            `سيتم فتح الملف تلقائياً في المرحلة النهائية`,
            `تم إنشاء الرد "${newReply.name}" بنجاح للفاكس "${selectedFax?.name}"`
        );
    };

    const handleReplyClick = (replyId) => {
        setSelectedReplyId(replyId);
        setShowReplyDetail(true);
    };

    const handleDeleteReply = (reply) => {
        setReplyToDelete(reply);
        setShowDeleteModal(true);
    };

    const confirmDeleteReply = async () => {
        if (!replyToDelete) return;

        setIsDeleting(true);
        try {
            const updatedReplies = replies.filter(r => r.id !== replyToDelete.id);
            await updateState({ faxReplies: updatedReplies });
            setShowDeleteModal(false);
            setReplyToDelete(null);
        } catch (error) {
            console.error('Error deleting reply:', error);
            toast.error('حدث خطأ أثناء حذف الرد', 'خطأ');
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleSelection = (replyId) => {
        const newSelection = new Set(selectedReplies);
        if (newSelection.has(replyId)) {
            newSelection.delete(replyId);
        } else {
            newSelection.add(replyId);
        }
        setSelectedReplies(newSelection);
    };

    const selectAll = () => {
        setSelectedReplies(new Set(allReplies.map(r => r.id)));
    };

    const clearSelection = () => {
        setSelectedReplies(new Set());
    };

    const deleteSelected = () => {
        if (selectedReplies.size === 0) return;
        setShowDeleteMultipleModal(true);
    };

    const confirmDeleteSelected = async () => {
        if (selectedReplies.size === 0) return;

        setIsDeleting(true);
        try {
            const updatedReplies = replies.filter(r => !selectedReplies.has(r.id));
            await updateState({ faxReplies: updatedReplies });
            setSelectedReplies(new Set());
            setShowDeleteMultipleModal(false);
            toast.success(`تم حذف ${selectedReplies.size} رد بنجاح`, 'تم الحذف');
        } catch (error) {
            console.error('Error deleting replies:', error);
            toast.error('حدث خطأ أثناء حذف الردود', 'خطأ');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <section className="replies-section">
                <div className="replies-header">
                    <h2>
                        <svg className="svg-icon-md" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 7a1 1 0 0 1 .117 1.993L8 9H6a1 1 0 0 1 -.117-1.993L6 7h2zm8 0a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2h6zm-8 4a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2h2zm8 0a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2h6zm-8 4a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2h2zm8 0a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2h6z"/>
                            <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                        </svg>
                        الردود على الفاكسات
                        <span className="replies-count">({allReplies.length})</span>
                    </h2>
                    <div className="replies-header-actions">
                        {allReplies.length > 0 && selectedReplies.size === 0 ? (
                            <button className="btn-secondary" onClick={selectAll}>
                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 11l3 3l8 -8"/>
                                    <path d="M7 21h-4a2 2 0 0 1 -2 -2v-4"/>
                                    <path d="M7 3h-4a2 2 0 0 0 -2 2v4"/>
                                    <path d="M17 3h4a2 2 0 0 1 2 2v4"/>
                                    <path d="M17 21h4a2 2 0 0 0 2 -2v-4"/>
                                </svg>
                                تحديد الكل
                            </button>
                        ) : selectedReplies.size > 0 ? (
                            <div className="faxes-actions">
                                <span className="selection-count">{selectedReplies.size} محدد</span>
                                <button className="btn-secondary" onClick={clearSelection}>
                                    إلغاء التحديد
                                </button>
                                <button className="btn-danger" onClick={deleteSelected}>
                                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1"/>
                                        <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z"/>
                                    </svg>
                                    حذف المحدد
                                </button>
                            </div>
                        ) : null}
                        <button 
                            className="btn-success" 
                            onClick={handleAddReply}
                            disabled={filteredFaxes.length === 0}
                        >
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1"/>
                            </svg>
                            إضافة رد
                        </button>
                    </div>
                </div>

                {/* قائمة الردود */}
                {allReplies.length > 0 ? (
                    <div className="replies-grid">
                        {allReplies.map(reply => (
                            <ReplyCard
                                key={reply.id}
                                reply={reply}
                                isSelected={selectedReplies.has(reply.id)}
                                onSelect={toggleSelection}
                                onClick={() => handleReplyClick(reply.id)}
                                onDelete={() => handleDeleteReply(reply)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="replies-empty">
                        <div className="empty-icon">
                            <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                                <path d="M12 11v6"/>
                                <path d="M9 14h6"/>
                            </svg>
                        </div>
                        <p>لا توجد ردود على الفاكسات</p>
                        <p className="empty-hint" style={{maxWidth: 'unset'}}>
                            {filteredFaxes.length === 0 
                                ? 'قم بفلترة الفاكسات أولاً لإضافة ردود' 
                                : 'اضغط على "إضافة رد" لإنشاء رد جديد'}
                        </p>
                    </div>
                )}
            </section>

            {/* Modal اختيار الفاكس */}
            <SelectFaxModal
                isOpen={showSelectFaxModal}
                onClose={() => {
                    setShowSelectFaxModal(false);
                    setTempSelectedFaxId(null);
                }}
                onSelect={handleFaxSelected}
                faxes={filteredFaxes}
                selectedFaxId={tempSelectedFaxId}
            />

            {/* Modal اختيار القالب */}
            <SelectTemplateModal
                isOpen={showSelectTemplateModal}
                onClose={() => {
                    setShowSelectTemplateModal(false);
                    setTempSelectedFaxId(null);
                }}
                onSelect={handleTemplateSelected}
                fax={filteredFaxes.find(f => f.id === tempSelectedFaxId)}
            />

            {/* Modal تفاصيل الرد */}
            {selectedReplyId && (
                <ReplyDetailModal
                    isOpen={showReplyDetail}
                    onClose={() => {
                        setShowReplyDetail(false);
                        setSelectedReplyId(null);
                    }}
                    replyId={selectedReplyId}
                />
            )}

            {/* Modal تأكيد الحذف */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setReplyToDelete(null);
                }}
                onConfirm={confirmDeleteReply}
                title="تأكيد حذف الرد"
                message="هل أنت متأكد من حذف هذا الرد؟"
                itemName={replyToDelete?.name}
                warningNote="لا يمكن التراجع عن هذا الإجراء"
                loading={isDeleting}
            />

            {/* Modal تأكيد حذف المحدد */}
            <ConfirmDeleteModal
                isOpen={showDeleteMultipleModal}
                onClose={() => setShowDeleteMultipleModal(false)}
                onConfirm={confirmDeleteSelected}
                title="تأكيد حذف الردود"
                message="هل أنت متأكد من حذف الردود المحددة؟"
                itemCount={`عدد الردود المحددة: ${selectedReplies.size}`}
                warningNote="لا يمكن التراجع عن هذا الإجراء"
                loading={isDeleting}
            />
        </>
    );
};

export default FaxRepliesSection;
