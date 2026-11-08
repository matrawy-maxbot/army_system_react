/**
 * MainClonedFilesSection Component
 * قسم الملفات المستنسخة في الصفحة الرئيسية
 * 
 * Features:
 * - عرض الملفات المستنسخة من القوالب
 * - عرض الملفات المستنسخة من ملفات الأرشيف
 * - إمكانية فتح الملف المستنسخ
 * - عرض المصدر الأصلي للملف (قالب أو ملف أرشيف)
 * - مودال معاينة للملفات
 */

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { electronAPI } from '../../services/electronAPI';
import FileDetailModal from '../archive/FileDetailModal';
import ClonedFilePreviewModal from './ClonedFilePreviewModal';

const MainClonedFilesSection = () => {
    const { appState } = useAppState();
    const [clonedFiles, setClonedFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showFileDetail, setShowFileDetail] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        loadClonedFiles();
    }, [appState.archiveCategories, appState.templates, appState.faxReplies, appState.filteredFaxes]);

    const loadClonedFiles = () => {
        const files = [];

        // استخراج جميع الملفات المستنسخة من الأرشيف
        if (appState.archiveCategories) {
            appState.archiveCategories.forEach(category => {
                if (category.folders) {
                    category.folders.forEach(folder => {
                        if (folder.files) {
                            folder.files.forEach(file => {
                                // التحقق من أن الملف مستنسخ
                                // إما عن طريق العلامة isCloned أو وجود "نسخة" في الاسم
                                if (file.isCloned || (file.name && file.name.includes('نسخة'))) {
                                    files.push({
                                        ...file,
                                        categoryId: category.id,
                                        categoryName: category.name,
                                        folderId: folder.id,
                                        folderName: folder.name,
                                        sourceType: 'archive', // ملف مستنسخ من الأرشيف
                                        originalName: file.clonedFromName || file.name.replace(' - نسخة', ''),
                                        displayDate: file.clonedAt || file.addedAt
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

        // استخراج الردود المنشأة من القوالب
        if (appState.faxReplies && appState.filteredFaxes) {
            appState.faxReplies.forEach(reply => {
                // التحقق من أن الرد منشأ من قالب
                if (reply.isCreatedFromTemplate && reply.createdFromTemplateId) {
                    // البحث عن معلومات الفاكس المرتبط
                    const linkedFax = appState.filteredFaxes.find(f => f.id === reply.faxId);
                    const faxIndex = appState.filteredFaxes.findIndex(f => f.id === reply.faxId);
                    
                    files.push({
                        id: reply.id,
                        name: reply.name,
                        originalFileName: `${reply.name}.${reply.fileType}`,
                        addedAt: reply.createdDate,
                        sourceType: 'template', // ملف منشأ من قالب
                        originalName: reply.createdFromTemplateName,
                        folderName: linkedFax ? `فاكس ${faxIndex + 1}` : 'غير محدد',
                        fileType: reply.fileType,
                        status: reply.status,
                        displayDate: reply.createdDate,
                        isReply: true,
                        faxId: reply.faxId
                    });
                }
            });
        }

        // ترتيب الملفات حسب تاريخ الاستنساخ أو الإضافة (الأحدث أولاً) وأخذ آخر 10
        const sortedFiles = files
            .sort((a, b) => {
                const dateA = new Date(a.displayDate);
                const dateB = new Date(b.displayDate);
                return dateB - dateA;
            })
            .slice(0, 10);

        setClonedFiles(sortedFiles);
    };

    const handleFileClick = (file) => {
        setSelectedFile(file);
        setShowPreviewModal(true);
    };

    const handleOpenFileDetails = (file) => {
        if (!file.isReply) {
            setShowPreviewModal(false);
            setShowFileDetail(true);
        }
    };

    const handleOpenFile = async (file) => {
        try {
            if (file.path) {
                await electronAPI.openFile(file.path);
            } else {
                alert('مسار الملف غير متوفر');
            }
        } catch (err) {
            console.error('Error opening file:', err);
            alert('فشل في فتح الملف');
        }
    };

    const getFileIcon = (filename) => {
        if (!filename) return '📄';
        const ext = filename.split('.').pop()?.toLowerCase();
        
        switch (ext) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📘';
            case 'xls':
            case 'xlsx':
                return '📗';
            case 'ppt':
            case 'pptx':
                return '📙';
            case 'txt':
                return '📃';
            case 'zip':
            case 'rar':
                return '📦';
            default:
                return '📄';
        }
    };

    const getFileExtension = (filename) => {
        if (!filename) return 'FILE';
        const ext = filename.split('.').pop();
        return ext ? ext.toUpperCase().slice(0, 5) : 'FILE';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 1) return 'الآن';
        if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffDays === 0) return 'اليوم';
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `منذ ${diffDays} أيام`;
        
        return date.toLocaleDateString('ar-EG', {
            day: 'numeric',
            month: 'short'
        });
    };

    const handleUpdate = () => {
        loadClonedFiles();
    };

    return (
        <>
            <div className="cloned-files-head">
                <div className="section-title">
                    <h2>الملفات المستنسخة</h2>
                    <span className="count">{clonedFiles.length} ملف</span>
                </div>
            </div>

            {clonedFiles.length === 0 ? (
                <div className="cloned-files-empty">
                    لا توجد ملفات مستنسخة حتى الآن
                </div>
            ) : (
                <div className="cloned-files-gallery">
                    {clonedFiles.map((file) => {
                        const extension = getFileExtension(file.originalFileName || file.name);
                        const isFromTemplate = file.sourceType === 'template';
                        
                        return (
                            <article 
                                key={file.id}
                                className="cloned-document-card"
                                onClick={() => handleFileClick(file)}
                            >
                                <div className="cloned-preview">
                                    <span className={`cloned-type ${extension === 'DOCX' || extension === 'DOC' ? 'word' : extension === 'XLSX' || extension === 'XLS' ? 'excel' : extension === 'PPTX' || extension === 'PPT' ? 'ppt' : ''}`}>
                                        {extension}
                                    </span>
                                    <div className="cloned-paper">
                                        {extension === 'PDF' ? (
                                            <>
                                                <div className="paper-head"></div>
                                                <div className="paper-line"></div>
                                                <div className="paper-line medium"></div>
                                                <div className="paper-line short"></div>
                                                <div className="paper-gap"></div>
                                                <div className="paper-line"></div>
                                                <div className="paper-line medium"></div>
                                                <div className="paper-block"></div>
                                                <div className="paper-line"></div>
                                                <div className="paper-line short"></div>
                                                <div className="paper-table">
                                                    <span></span><span></span><span></span>
                                                    <span></span><span></span><span></span>
                                                    <span></span><span></span><span></span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="paper-head"></div>
                                                <div className="paper-gap"></div>
                                                <div className="paper-line"></div>
                                                <div className="paper-line"></div>
                                                <div className="paper-line medium"></div>
                                                <div className="paper-gap"></div>
                                                <div className="paper-line"></div>
                                                <div className="paper-line short"></div>
                                                <div className="paper-block"></div>
                                                <div className="paper-gap"></div>
                                                <div className="paper-line"></div>
                                                <div className="paper-line medium"></div>
                                                <div className="paper-line"></div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="cloned-details">
                                    <div className="cloned-filename">
                                        {file.name}
                                    </div>
                                    <div className="cloned-meta">
                                        <span>{formatDate(file.displayDate)}</span>
                                        <span className="open-hint">معاينة ↗</span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {/* Preview Modal */}
            {showPreviewModal && selectedFile && (
                <ClonedFilePreviewModal
                    file={selectedFile}
                    isOpen={showPreviewModal}
                    onClose={() => {
                        setShowPreviewModal(false);
                        setSelectedFile(null);
                    }}
                    onOpenDetails={handleOpenFileDetails}
                    onOpenFile={handleOpenFile}
                />
            )}

            {/* File Detail Modal */}
            {showFileDetail && selectedFile && !selectedFile.isReply && (
                <FileDetailModal
                    file={selectedFile}
                    isOpen={showFileDetail}
                    onClose={() => {
                        setShowFileDetail(false);
                        setSelectedFile(null);
                    }}
                    onUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export default MainClonedFilesSection;
