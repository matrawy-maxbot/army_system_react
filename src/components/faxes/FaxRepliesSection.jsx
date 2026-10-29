/**
 * FaxRepliesSection Component
 * قسم الردود على الفاكسات - عرض وإدارة الردود على الفاكسات المفلترة
 */

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import './FaxReplies.css';
import SelectFaxModal from './SelectFaxModal';
import SelectTemplateModal from './SelectTemplateModal';
import ReplyCard from './ReplyCard';
import ReplyDetailModal from './ReplyDetailModal';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';

const FaxRepliesSection = () => {
    const { appState, updateState } = useAppState();
    const [tempSelectedFaxId, setTempSelectedFaxId] = useState(null);
    const [showSelectFaxModal, setShowSelectFaxModal] = useState(false);
    const [showSelectTemplateModal, setShowSelectTemplateModal] = useState(false);
    const [showReplyDetail, setShowReplyDetail] = useState(false);
    const [selectedReplyId, setSelectedReplyId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [replyToDelete, setReplyToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
            note: ''
        };

        const updatedReplies = [...replies, newReply];
        await updateState({ faxReplies: updatedReplies });

        setShowSelectTemplateModal(false);
        setTempSelectedFaxId(null);

        // في المرحلة النهائية، سيتم فتح الملف هنا
        console.log('Reply created:', newReply);
        alert(`تم إنشاء الرد "${newReply.name}" بنجاح للفاكس "${selectedFax?.name}"\nفي المرحلة النهائية، سيتم فتح الملف تلقائياً`);
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
            alert('حدث خطأ أثناء حذف الرد');
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
                        <p className="empty-hint">
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
        </>
    );
};

export default FaxRepliesSection;
