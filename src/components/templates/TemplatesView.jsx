import React, { useState, useEffect } from 'react';
import { dataAPI } from '../../services/electronAPI';
import TemplateCard from './TemplateCard';
import AddTemplateModal from './AddTemplateModal';

const TemplatesView = () => {
    const [templates, setTemplates] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data && result.data.templates) {
                setTemplates(result.data.templates);
            }
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    };

    const handleAddTemplate = async (templateData) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const newTemplate = {
                    id: Date.now(),
                    ...templateData,
                    createdAt: new Date().toISOString()
                };

                const updatedTemplates = [...(result.data.templates || []), newTemplate];
                result.data.templates = updatedTemplates;

                await dataAPI.saveData(result.data);
                loadTemplates();
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
                const updatedTemplates = result.data.templates.map(t =>
                    t.id === templateId ? { ...t, name: newName } : t
                );

                result.data.templates = updatedTemplates;
                await dataAPI.saveData(result.data);
                loadTemplates();
            }
        } catch (error) {
            console.error('Error editing template:', error);
            alert('حدث خطأ أثناء تعديل القالب');
        }
    };

    const handleDeleteTemplate = async (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        if (!confirm(`هل أنت متأكد من حذف القالب "${template.name}"؟`)) {
            return;
        }

        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedTemplates = result.data.templates.filter(t => t.id !== templateId);
                result.data.templates = updatedTemplates;

                await dataAPI.saveData(result.data);
                loadTemplates();
                setSelectedTemplate(null);
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('حدث خطأ أثناء حذف القالب');
        }
    };

    const handleOpenTemplate = (template) => {
        alert(`سيتم فتح الملف: ${template.fileName}\n(هذه محاكاة - لم يتم تنفيذ الفتح الفعلي بعد)`);
    };

    return (
        <div className="templates-section">
            <div className="templates-header">
                <h2>
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                    </svg>
                    القوالب
                    <span className="files-count">({templates.length})</span>
                </h2>
                <button className="btn-add-category" onClick={() => setShowAddModal(true)}>
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 0 1 0 2h-5v5a1 1 0 0 1 -2 0v-5h-5a1 1 0 0 1 0 -2h5v-5a1 1 0 0 1 1 -1" />
                    </svg>
                    إضافة قالب
                </button>
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
                </div>
            ) : (
                <div className="templates-grid">
                    {templates.map(template => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onOpen={() => handleOpenTemplate(template)}
                            onEdit={(newName) => handleEditTemplate(template.id, newName)}
                            onDelete={() => handleDeleteTemplate(template.id)}
                        />
                    ))}
                </div>
            )}

            {showAddModal && (
                <AddTemplateModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddTemplate}
                />
            )}
        </div>
    );
};

export default TemplatesView;
