import React, { useState, useEffect } from 'react';
import { dataAPI } from '../../services/electronAPI';
import TemplateCard from './TemplateCard';
import AddTemplateModal from './AddTemplateModal';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import ReorderTemplatesModal from './ReorderTemplatesModal';
import TemplateDetailModal from './TemplateDetailModal';

const DEFAULT_TEMPLATES = [
    { id: 1, name: 'نموذج عقد عمل', fileName: 'نموذج عقد عمل.docx', fileType: 'DOCX' },
    { id: 2, name: 'جدول المصروفات', fileName: 'جدول المصروفات.xlsx', fileType: 'XLSX' },
    { id: 3, name: 'التقرير الشهري', fileName: 'التقرير الشهري.pdf', fileType: 'PDF' }
];

const TemplatesView = () => {
    const [templates, setTemplates] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [templateBeingEdited, setTemplateBeingEdited] = useState(null);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);
    const [showReorderModal, setShowReorderModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                if (Array.isArray(result.data.templates) && result.data.templates.length > 0) {
                    // ترتيب القوالب حسب حقل order
                    const sortedTemplates = (result.data.templates || []).sort((a, b) => {
                        const orderA = a.order !== undefined ? a.order : 999999;
                        const orderB = b.order !== undefined ? b.order : 999999;
                        return orderA - orderB;
                    });
                    setTemplates(sortedTemplates);
                } else if (!result.data.templates || result.data.templates.length === 0) {
                    // Seed initial default templates
                    setTemplates(DEFAULT_TEMPLATES);
                    result.data.templates = DEFAULT_TEMPLATES;
                    await dataAPI.saveData(result.data);
                }
            } else {
                setTemplates(DEFAULT_TEMPLATES);
            }
        } catch (error) {
            console.error('Error loading templates:', error);
            setTemplates(DEFAULT_TEMPLATES);
        }
    };

    const handleAddTemplate = async (templateData) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                // حساب أعلى order موجود
                const maxOrder = Math.max(0, ...(result.data.templates || []).map(t => t.order || 0));

                const newTemplate = {
                    id: Date.now(),
                    ...templateData,
                    createdAt: new Date().toISOString(),
                    order: maxOrder + 1
                };

                const updatedTemplates = [...(result.data.templates || []), newTemplate];
                result.data.templates = updatedTemplates;

                await dataAPI.saveData(result.data);
                setTemplates(updatedTemplates);
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error adding template:', error);
            alert('حدث خطأ أثناء إضافة القالب');
        }
    };

    const handleEditTemplate = async (templateId, newName) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedTemplates = (result.data.templates || []).map(t =>
                    t.id === templateId ? { ...t, name: newName } : t
                );

                result.data.templates = updatedTemplates;
                await dataAPI.saveData(result.data);
                setTemplates(updatedTemplates);
            }
        } catch (error) {
            console.error('Error editing template:', error);
            alert('حدث خطأ أثناء تعديل القالب');
        }
    };

    const handleDeleteTemplate = async (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        setTemplateToDelete(template);
        setShowDeleteModal(true);
    };

    const confirmDeleteTemplate = async () => {
        if (!templateToDelete) return;

        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedTemplates = (result.data.templates || []).filter(t => t.id !== templateToDelete.id);
                result.data.templates = updatedTemplates;

                await dataAPI.saveData(result.data);
                setTemplates(updatedTemplates);
                
                // إغلاق modal التعديل إذا كان القالب المحذوف هو المفتوح
                if (templateBeingEdited?.id === templateToDelete.id) {
                    setRenameModalOpen(false);
                    setTemplateBeingEdited(null);
                }
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('حدث خطأ أثناء حذف القالب');
        } finally {
            setShowDeleteModal(false);
            setTemplateToDelete(null);
        }
    };

    const handleStartRename = (template) => {
        setTemplateBeingEdited(template);
        setNewTemplateName(template.name || '');
        setRenameModalOpen(true);
    };

    const handleCloseRenameModal = () => {
        setRenameModalOpen(false);
        setTemplateBeingEdited(null);
        setNewTemplateName('');
    };

    const handleSaveTemplateName = async () => {
        const cleanName = newTemplateName.trim();

        if (!cleanName) {
            alert('يرجى إدخال الاسم');
            return;
        }

        if (!templateBeingEdited) {
            return;
        }

        await handleEditTemplate(templateBeingEdited.id, cleanName);
        handleCloseRenameModal();
    };

    const handleOpenTemplate = (template) => {
        setSelectedTemplate(template);
        setShowDetailModal(true);
    };

    const handleUseTemplate = (template) => {
        alert('سيتم فتح القالب للاستخدام: ' + template.name);
        // هنا يمكنك إضافة المنطق لفتح الملف باستخدام electronAPI
    };

    const handleDownloadTemplate = (template) => {
        alert('سيتم تنزيل القالب: ' + template.name);
        // هنا يمكنك إضافة المنطق لتنزيل الملف
    };

    const handleSaveOrder = async (orderedTemplates) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                result.data.templates = orderedTemplates;
                await dataAPI.saveData(result.data);
                setTemplates(orderedTemplates);
            }
        } catch (error) {
            console.error('Error saving templates order:', error);
            alert('حدث خطأ أثناء حفظ الترتيب');
        }
    };

    return (
        <section className="templates-section" dir="rtl">
            <div className="section-header">
                <h3>
                    القوالب <span className="count" id="templateCount">{String(templates.length).padStart(2, '0')}</span>
                </h3>
                <div className="templates-header-actions">
                    {templates.length > 1 && (
                        <button
                            type="button"
                            className="btn-reorder-templates"
                            onClick={() => setShowReorderModal(true)}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 8h18" />
                                <path d="M3 16h18" />
                                <path d="M11 3v18" />
                            </svg>
                            <span>إعادة الترتيب</span>
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn-add-template"
                        onClick={() => setShowAddModal(true)}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>إضافة قالب</span>
                    </button>
                </div>
            </div>

            {templates.length === 0 ? (
                <div className="templates-empty">
                    <div className="empty-icon">
                        <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                        </svg>
                    </div>
                    <p>لا توجد قوالب</p>
                    <span className="empty-hint">أضف قوالب لإنشاء مستندات بسرعة</span>
                    <button
                        type="button"
                        className="btn-add-template"
                        style={{ marginTop: '16px' }}
                        onClick={() => setShowAddModal(true)}
                    >
                        إضافة قالب
                    </button>
                </div>
            ) : (
                <div className="templates-grid" id="templatesGrid">
                    {templates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onOpen={() => handleOpenTemplate(template)}
                            onEdit={() => handleStartRename(template)}
                            onDelete={() => handleDeleteTemplate(template.id)}
                        />
                    ))}
                </div>
            )}

            {renameModalOpen && (
                <div className="template-rename-modal show" id="renameModal" onClick={handleCloseRenameModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>تعديل اسم القالب</h3>
                        <input
                            id="templateNewName"
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                            placeholder="اسم القالب الجديد"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveTemplateName()}
                        />
                        <div className="modal-buttons">
                            <button id="saveTemplateName" type="button" onClick={handleSaveTemplateName}>
                                حفظ
                            </button>
                            <button id="cancelTemplateName" type="button" onClick={handleCloseRenameModal}>
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <AddTemplateModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddTemplate}
                />
            )}

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setTemplateToDelete(null);
                }}
                onConfirm={confirmDeleteTemplate}
                title="تأكيد حذف القالب"
                message="هل أنت متأكد من حذف هذا القالب؟"
                itemName={templateToDelete?.name}
                warningNote="لا يمكن التراجع عن هذا الإجراء"
            />

            {showReorderModal && (
                <ReorderTemplatesModal
                    templates={templates}
                    onClose={() => setShowReorderModal(false)}
                    onSave={handleSaveOrder}
                />
            )}

            <TemplateDetailModal
                template={selectedTemplate}
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedTemplate(null);
                }}
                onUseTemplate={handleUseTemplate}
                onDownloadTemplate={handleDownloadTemplate}
            />
        </section>
    );
};

export default TemplatesView;
