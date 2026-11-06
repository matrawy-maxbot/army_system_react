import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { SettingsProvider } from './context/SettingsContext';
import { ModalStackProvider } from './context/ModalStackContext';
import { ToastProvider, useToast } from './components/common/ToastContainer';
import { TitleBar, Header, Sidebar, TabBar, Footer } from './components/layout';
import { OriginalFaxSection, FaxGrid, UploadFaxModal, FilterFaxModal, DeleteFaxModal, FaxRepliesSection, FaxDetailModal, SelectFaxModal, SelectTemplateModal, ReplyDetailModal } from './components/faxes';
import AddToListsModal from './components/common/AddToListsModal';
import ConfirmPrintModal from './components/common/ConfirmPrintModal';
import ConfirmDeleteModal from './components/common/ConfirmDeleteModal';
import ListItemsView from './components/lists/ListItemsView';
// import { FilesList } from './components/files';
import { RemindersList } from './components/reminders';
import { TasksList } from './components/tasks';
import { MainRemindersSection } from './components/main';
import { ListsView } from './components/lists';
import { TemplatesView } from './components/templates';
import { SettingsModal } from './components/settings';

import ArchivePage from './pages/ArchivePage';
import BackupPage from './pages/BackupPage';
import './styles/files.css';
import './styles/main-page.css';

function AppContent() {
    const { updateState, appState } = useAppState();
    const toast = useToast();
    
    // Modal states
    const [showSettings, setShowSettings] = useState(false);
    const [showUploadFax, setShowUploadFax] = useState(false);
    const [showFilterFax, setShowFilterFax] = useState(false);
    const [showDeleteFax, setShowDeleteFax] = useState(false);
    const [showAddToLists, setShowAddToLists] = useState(false);
    const [itemToAddToLists, setItemToAddToLists] = useState(null);
    const [showListDetails, setShowListDetails] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    
    // Fax detail and reply modals
    const [showFaxDetail, setShowFaxDetail] = useState(false);
    const [selectedFaxId, setSelectedFaxId] = useState(null);
    const [showSelectFax, setShowSelectFax] = useState(false);
    const [showSelectTemplate, setShowSelectTemplate] = useState(false);
    const [tempSelectedFaxId, setTempSelectedFaxId] = useState(null);
    
    // Reply detail modal
    const [showReplyDetail, setShowReplyDetail] = useState(false);
    const [selectedReplyId, setSelectedReplyId] = useState(null);
    
    // Selection mode for faxes
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedFaxes, setSelectedFaxes] = useState(new Set());
    const [showPrintConfirm, setShowPrintConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // Section state - حالة التبديل بين الأقسام
    const [activeSection, setActiveSection] = useState('main');

    const handleUpload = async (uploadData) => {
        const { type, pdf, pdfs, images } = uploadData;
        
        console.log('Upload data:', uploadData);
        
        // إنشاء الفاكس الأصلي
        let originalFax;
        let faxPages = [];
        
        // معالجة النوع الجديد: mixed (ملفات وصور متعددة)
        if (type === 'mixed') {
            const allPdfs = pdfs || [];
            const allImages = images || [];
            const totalFiles = allPdfs.length + allImages.length;
            
            if (totalFiles === 0) {
                console.error('لا توجد ملفات للرفع');
                return;
            }
            
            // تحديد نوع الفاكس واسمه
            let fileType = 'mixed';
            let fileName = '';
            
            if (allPdfs.length > 0 && allImages.length === 0) {
                fileType = 'pdf';
                fileName = allPdfs.length === 1 ? allPdfs[0].name : `${allPdfs.length} ملفات PDF`;
            } else if (allImages.length > 0 && allPdfs.length === 0) {
                fileType = 'images';
                fileName = `${allImages.length} صورة`;
            } else {
                fileType = 'mixed';
                fileName = `${allPdfs.length} PDF + ${allImages.length} صورة`;
            }
            
            // حساب عدد الصفحات (كل PDF له عدد عشوائي من الصفحات، كل صورة = صفحة واحدة)
            let pageCount = allImages.length;
            allPdfs.forEach(() => {
                pageCount += Math.floor(Math.random() * 10) + 3; // صفحات عشوائية لكل PDF
            });
            
            originalFax = {
                id: Date.now(),
                fileName: fileName,
                filePath: 'mock://mixed-files',
                fileType: fileType,
                images: allImages.map(img => img.preview),
                pdfs: allPdfs,
                pageCount: pageCount,
                uploadDate: new Date().toISOString()
            };
            
            // إنشاء صفحات من ملفات PDF
            let currentPageIndex = 0;
            allPdfs.forEach((pdfFile, pdfIndex) => {
                const pdfPageCount = Math.floor(Math.random() * 10) + 3;
                for (let i = 0; i < pdfPageCount; i++) {
                    faxPages.push({
                        id: `page-${Date.now()}-${currentPageIndex}`,
                        pageIndex: currentPageIndex,
                        thumbnailUrl: `https://via.placeholder.com/200x280/ef4444/ffffff?text=PDF+${pdfIndex + 1}+صفحة+${i+1}`,
                        assignedFaxId: null,
                        isStandalone: false,
                        sourceType: 'pdf',
                        sourceName: pdfFile.name
                    });
                    currentPageIndex++;
                }
            });
            
            // إنشاء صفحات من الصور
            allImages.forEach((img, i) => {
                faxPages.push({
                    id: `page-${Date.now()}-${currentPageIndex}`,
                    pageIndex: currentPageIndex,
                    thumbnailUrl: img.preview,
                    assignedFaxId: null,
                    isStandalone: false,
                    sourceType: 'image',
                    sourceName: img.name
                });
                currentPageIndex++;
            });
        }
        // معالجة النوع القديم للتوافق
        else if (type === 'pdf' && pdf) {
            // معالجة PDF
            originalFax = {
                id: Date.now(),
                fileName: pdf.name,
                filePath: pdf.preview,
                fileType: 'pdf',
                images: [],
                pageCount: Math.floor(Math.random() * 10) + 3, // رقم عشوائي للاختبار
                uploadDate: new Date().toISOString()
            };
            
            // إنشاء صفحات للـ PDF
            for (let i = 0; i < originalFax.pageCount; i++) {
                faxPages.push({
                    id: `page-${Date.now()}-${i}`,
                    pageIndex: i,
                    thumbnailUrl: `https://via.placeholder.com/200x280/e8eaed/1a202c?text=صفحة+${i+1}`,
                    assignedFaxId: null,
                    isStandalone: false
                });
            }
        } else if (type === 'images' && images && images.length > 0) {
            // معالجة الصور
            originalFax = {
                id: Date.now(),
                fileName: `مجموعة_صور_${images.length}.pdf`,
                filePath: 'mock://merged-pdf',
                fileType: 'images',
                images: images.map(img => img.preview),
                pageCount: images.length,
                uploadDate: new Date().toISOString()
            };
            
            // إنشاء صفحات من الصور
            faxPages = images.map((img, i) => ({
                id: `page-${Date.now()}-${i}`,
                pageIndex: i,
                thumbnailUrl: img.preview,
                assignedFaxId: null,
                isStandalone: false
            }));
        }
        
        // تحديث الحالة مباشرة
        if (originalFax) {
            await updateState({
                originalFax,
                faxPages,
                currentFilteringSession: { isActive: false, nextFaxNumber: 1 }
            });
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        
        // Update active class on sidebar buttons
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === section) {
                btn.classList.add('active');
            }
        });
    };

    const handleAddToLists = (item) => {
        setItemToAddToLists(item);
        setShowAddToLists(true);
    };

    const handleCloseAddToLists = () => {
        setShowAddToLists(false);
        setItemToAddToLists(null);
    };

    const handleShowListDetails = (list) => {
        setSelectedList(list);
        setShowListDetails(true);
    };

    const handleCloseListDetails = () => {
        setShowListDetails(false);
        setSelectedList(null);
    };

    const handleOpenPinnedFolder = (folderId) => {
        // الانتقال لصفحة الأرشيف وفتح المجلد
        setActiveSection('archive');
        // يمكن إضافة منطق لفتح المجلد مباشرة
    };

    // Handle fax card click
    const handleFaxCardClick = (faxId) => {
        setSelectedFaxId(faxId);
        setShowFaxDetail(true);
    };

    // Handle create reply
    const handleCreateReply = (faxId) => {
        setTempSelectedFaxId(faxId);
        setShowSelectTemplate(true);
    };

    // Handle template selected
    const handleTemplateSelected = async (template) => {
        if (!tempSelectedFaxId) return;

        const selectedFax = appState.filteredFaxes?.find(f => f.id === tempSelectedFaxId);

        // إنشاء رد جديد
        const newReply = {
            id: `reply-${Date.now()}`,
            faxId: tempSelectedFaxId,
            name: template ? `رد - ${template.name}` : 'مستند فارغ',
            templateId: template?.id || null,
            templateName: template?.name || null,
            fileType: template?.fileType || 'docx',
            status: 'draft',
            createdDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            note: ''
        };

        const updatedReplies = [...(appState.faxReplies || []), newReply];
        await updateState({ faxReplies: updatedReplies });

        setShowSelectTemplate(false);
        setTempSelectedFaxId(null);

        toast.success(
            `تم إنشاء الرد "${newReply.name}" بنجاح للفاكس "${selectedFax?.name}"`,
            'تم إنشاء الرد'
        );
    };

    // Handle delete fax from detail modal
    const handleDeleteFaxFromDetail = async (faxId) => {
        const updatedFaxes = appState.filteredFaxes?.filter(f => f.id !== faxId) || [];
        await updateState({ filteredFaxes: updatedFaxes });
        setShowFaxDetail(false);
        toast.success('تم حذف الفاكس بنجاح', 'تم الحذف');
    };

    // Check if fax is in lists
    const isFaxInLists = (faxId) => {
        return appState.lists?.some(list => 
            list.items?.some(item => item.type === 'fax' && item.itemId === faxId)
        ) || false;
    };

    // Handle reply row click
    const handleReplyClick = (faxId) => {
        // Find the reply for this fax
        const reply = appState.faxReplies?.find(r => r.faxId === faxId);
        if (reply) {
            setSelectedReplyId(reply.id);
            setShowReplyDetail(true);
        }
    };

    // Selection mode handlers
    const handleToggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedFaxes(new Set());
    };

    const handleToggleFaxSelection = (faxId) => {
        const newSelection = new Set(selectedFaxes);
        if (newSelection.has(faxId)) {
            newSelection.delete(faxId);
        } else {
            newSelection.add(faxId);
        }
        setSelectedFaxes(newSelection);
    };

    const handleSelectAll = () => {
        const allFaxIds = new Set();
        // Don't include original fax - only filtered faxes can be selected
        appState.filteredFaxes?.forEach(fax => allFaxIds.add(fax.id));
        setSelectedFaxes(allFaxIds);
    };

    const handleClearSelection = () => {
        setSelectedFaxes(new Set());
    };

    const handlePrintSelected = () => {
        if (selectedFaxes.size === 0) {
            toast.error('لم يتم تحديد أي فاكسات', 'خطأ');
            return;
        }
        setShowPrintConfirm(true);
    };

    const confirmPrint = () => {
        toast.success(`سيتم طباعة ${selectedFaxes.size} فاكس`, 'طباعة');
        console.log('Print faxes:', Array.from(selectedFaxes));
        setShowPrintConfirm(false);
    };

    const handleDeleteSelected = () => {
        if (selectedFaxes.size === 0) {
            toast.error('لم يتم تحديد أي فاكسات', 'خطأ');
            return;
        }
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        // Delete selected faxes (only filtered faxes, not original)
        let updatedFilteredFaxes = appState.filteredFaxes || [];

        updatedFilteredFaxes = updatedFilteredFaxes.filter(
            fax => !selectedFaxes.has(fax.id)
        );

        await updateState({ 
            filteredFaxes: updatedFilteredFaxes
        });

        toast.success(`تم حذف ${selectedFaxes.size} فاكس بنجاح`, 'تم الحذف');
        setSelectedFaxes(new Set());
        setSelectionMode(false);
        setShowDeleteConfirm(false);
    };

    return (
        <div className="app" dir="rtl">
            <TitleBar />
            
            <TabBar onSectionChange={handleSectionChange} activeSection={activeSection} />
            <Sidebar 
                onSectionChange={handleSectionChange}
                onShowListDetails={handleShowListDetails}
                onOpenPinnedFolder={handleOpenPinnedFolder}
            />
            
            <main className="container">
                <Header onSettingsClick={() => setShowSettings(true)} />
                <div className="container-content">
                    {/* قسم الصفحة الرئيسية - الفئات والفاكسات */}
                    {activeSection === 'main' && (
                        <>
                            {/* Top Bar - Heading & Upload Button */}
                            <div className="topbar">
                                <div className="heading">
                                    <h1>الرئيسية</h1>
                                    <p>إدارة الفاكسات والردود والمتابعة</p>
                                </div>
                                <button 
                                    className="primary" 
                                    onClick={() => setShowUploadFax(true)}
                                >
                                    + رفع فاكس أصلي
                                </button>
                            </div>

                            {/* Workflow Progress */}
                            <div className="workflow">
                                <div className="workflow-head">
                                    <strong>مسار معالجة الفاكس</strong>
                                    <span>المرحلة 2 من 4</span>
                                </div>
                                <div className="steps">
                                    <div className="step done">
                                        <div className="circle">✓</div>
                                        <div className="label">
                                            رفع الفاكس
                                            <small>تم الرفع</small>
                                        </div>
                                    </div>
                                    <div className="step active">
                                        <div className="circle">2</div>
                                        <div className="label">
                                            فلترة الصفحات
                                            <small>قيد المعالجة</small>
                                        </div>
                                    </div>
                                    <div className="step">
                                        <div className="circle">3</div>
                                        <div className="label">
                                            الردود
                                            <small>إنشاء المستندات</small>
                                        </div>
                                    </div>
                                    <div className="step">
                                        <div className="circle">4</div>
                                        <div className="label">
                                            التذكيرات
                                            <small>المتابعة</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Faxes Section */}
                            <div className="section-head">
                                <div className="section-title">
                                    <h2>الفاكسات</h2>
                                    <span>{(appState.filteredFaxes?.length || 0) + (appState.originalFax ? 1 : 0)} عناصر</span>
                                </div>
                                <div className="actions">
                                    {!selectionMode ? (
                                        <>
                                            <button onClick={handleToggleSelectionMode}>تحديد</button>
                                            <button 
                                                className="selected" 
                                                onClick={() => setShowFilterFax(true)}
                                            >
                                                فلترة الصفحات
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={handlePrintSelected}
                                                disabled={selectedFaxes.size === 0}
                                                title="طباعة المحدد"
                                            >
                                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"/>
                                                    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"/>
                                                    <path d="M7 13h10v8h-10z"/>
                                                </svg>
                                                طباعة
                                            </button>
                                            <button 
                                                onClick={handleDeleteSelected}
                                                disabled={selectedFaxes.size === 0}
                                                className="btn-danger"
                                                title="حذف المحدد"
                                            >
                                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z"/>
                                                </svg>
                                                حذف
                                            </button>
                                            <button onClick={handleSelectAll} title="تحديد الكل">
                                                تحديد الكل
                                            </button>
                                            <button 
                                                onClick={handleToggleSelectionMode}
                                                className="selected"
                                                title="إلغاء التحديد"
                                            >
                                                إلغاء
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Fax Grid */}
                            <div className="fax-grid">
                                {/* Original Fax Card */}
                                {appState.originalFax && (
                                    <article 
                                        className="fax-card original"
                                        data-name="الفاكس الأصلي"
                                        onClick={() => {
                                            // Original fax can always be clicked to open filter modal
                                            // It is not selectable in selection mode
                                            if (!selectionMode) {
                                                setShowFilterFax(true);
                                            }
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        
                                        <div className="preview">
                                            <span className="tag">الملف المصدر</span>
                                            <div className="paper">
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <div className="stamp"></div>
                                                <i></i>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="card-title">
                                                <strong>الفاكس الأصلي</strong>
                                                <span className="source">المصدر</span>
                                            </div>
                                            <div className="meta">
                                                <span>PDF · {appState.originalFax.pageCount} صفحات · {new Date(appState.originalFax.uploadDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        
                                        {!selectionMode && (
                                            <>
                                                {/* Star button for original fax */}
                                                <button 
                                                    className={`fax-star-btn ${appState.originalFax.id && appState.lists?.some(list => 
                                                        list.items?.some(item => item.type === 'originalFax' && item.itemId === appState.originalFax.id)
                                                    ) ? 'in-list' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToLists({
                                                            type: 'originalFax',
                                                            id: appState.originalFax.id,
                                                            fileName: appState.originalFax.fileName
                                                        });
                                                    }}
                                                    title="إضافة إلى القوائم"
                                                >
                                                    <svg viewBox="0 0 24 24" fill={appState.originalFax.id && appState.lists?.some(list => 
                                                        list.items?.some(item => item.type === 'originalFax' && item.itemId === appState.originalFax.id)
                                                    ) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                                        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>
                                                    </svg>
                                                </button>
                                                
                                                {/* Delete button - appears on hover below star */}
                                                <button 
                                                    className="fax-delete-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowDeleteFax(true);
                                                    }}
                                                    title="حذف الفاكس الأصلي"
                                                >
                                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z"/>
                                                        <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z"/>
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </article>
                                )}

                                {/* Filtered Faxes */}
                                {appState.filteredFaxes && appState.filteredFaxes.map((fax, index) => {
                                    const hasReply = appState.faxReplies?.some(r => r.faxId === fax.id);
                                    const isInLists = isFaxInLists(fax.id);
                                    const isSelected = selectedFaxes.has(fax.id);
                                    
                                    return (
                                        <article 
                                            key={fax.id} 
                                            className={`fax-card ${isSelected ? 'selected' : ''}`}
                                            data-name={`فاكس ${index + 1}`}
                                            onClick={() => {
                                                if (selectionMode) {
                                                    handleToggleFaxSelection(fax.id);
                                                } else {
                                                    handleFaxCardClick(fax.id);
                                                }
                                            }}
                                        >
                                            {selectionMode && (
                                                <div className="selection-checkbox">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isSelected}
                                                        onChange={() => handleToggleFaxSelection(fax.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            )}
                                            
                                            <div className="preview">
                                                <span className="tag">صفحات</span>
                                                <div className="paper">
                                                    <i></i>
                                                    <i></i>
                                                    <i></i>
                                                    <i></i>
                                                    <div className="stamp"></div>
                                                    <i></i>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="card-title">
                                                    <strong>{fax.name || `فاكس ${index + 1}`}</strong>
                                                    <span className="meta">{new Date(fax.creationDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</span>
                                                </div>
                                                <div className="meta">
                                                    <span>{fax.pages?.length || 0} صفحة · فاكس مفلتر</span>
                                                </div>
                                                
                                                {/* Check if there's a reply */}
                                                {hasReply ? (
                                                    <>
                                                        <div className="card-divider"></div>
                                                        <div 
                                                            className="file-row clickable" 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleReplyClick(fax.id);
                                                            }}
                                                            title="عرض تفاصيل الرد"
                                                        >
                                                            <div className="word-icon">W</div>
                                                            <div className="file-info">
                                                                <strong>رد {fax.name || `فاكس ${index + 1}`}</strong>
                                                                <span>Word · مستند مرتبط</span>
                                                            </div>
                                                            <span className="status">مسودة</span>
                                                            
                                                            {/* Chevron indicator - shows on hover */}
                                                            <span className="file-chevron">‹</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="card-divider"></div>
                                                        <button 
                                                            className="add-filter" 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCreateReply(fax.id);
                                                            }}
                                                        >
                                                            + إنشاء رد لهذا الفاكس
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            
                                            {!selectionMode && (
                                                <button 
                                                    className={`fax-star-btn ${isInLists ? 'in-list' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToLists({
                                                            type: 'fax',
                                                            id: fax.id,
                                                            fileName: fax.name || `فاكس ${index + 1}`
                                                        });
                                                    }}
                                                    title="إضافة إلى القوائم"
                                                >
                                                    <svg viewBox="0 0 24 24" fill={isInLists ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                                        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>
                                                    </svg>
                                                </button>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>

                            {/* Reminders Section */}
                            <div className="reminders">
                                <MainRemindersSection />
                            </div>
                        </>
                    )}

                    {/* قسم القوالب */}
                    {activeSection === 'templates' && <TemplatesView />}

                    {/* قسم التذكيرات */}
                    {activeSection === 'reminders' && <RemindersList />}

                    {/* قسم المهمات */}
                    {activeSection === 'tasks' && <TasksList />}

                    {/* قسم القوائم */}
                    {activeSection === 'lists' && <ListsView />}

                    {/* قسم الأرشفة */}
                    {activeSection === 'archive' && <ArchivePage />}
                    {activeSection === 'backup' && <BackupPage />}
                </div>
            </main>
            
            {/* نظام الملفات اليومية */}
            {/* <FilesList /> */}
            
            <Footer />

            {/* Modals */}
            <UploadFaxModal 
                isOpen={showUploadFax}
                onClose={() => setShowUploadFax(false)}
                onUpload={handleUpload}
            />

            <FilterFaxModal 
                isOpen={showFilterFax}
                onClose={() => setShowFilterFax(false)}
            />

            <DeleteFaxModal 
                isOpen={showDeleteFax}
                onClose={() => setShowDeleteFax(false)}
            />

            <AddToListsModal 
                isOpen={showAddToLists}
                onClose={handleCloseAddToLists}
                item={itemToAddToLists}
            />

            <SettingsModal 
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />

            {showListDetails && selectedList && (
                <ListItemsView
                    list={selectedList}
                    onClose={handleCloseListDetails}
                />
            )}

            {/* Fax Detail Modal */}
            {showFaxDetail && selectedFaxId && (
                <FaxDetailModal
                    isOpen={showFaxDetail}
                    onClose={() => setShowFaxDetail(false)}
                    faxId={selectedFaxId}
                    onAddToLists={(fax) => handleAddToLists({
                        type: 'fax',
                        id: fax.id,
                        fileName: fax.name
                    })}
                    onDelete={handleDeleteFaxFromDetail}
                />
            )}

            {/* Select Template Modal for Creating Reply */}
            {showSelectTemplate && (
                <SelectTemplateModal
                    isOpen={showSelectTemplate}
                    onClose={() => {
                        setShowSelectTemplate(false);
                        setTempSelectedFaxId(null);
                    }}
                    onSelect={handleTemplateSelected}
                />
            )}

            {/* Reply Detail Modal */}
            {showReplyDetail && selectedReplyId && (
                <ReplyDetailModal
                    isOpen={showReplyDetail}
                    onClose={() => setShowReplyDetail(false)}
                    replyId={selectedReplyId}
                />
            )}

            {/* Print Confirmation Modal */}
            <ConfirmPrintModal
                isOpen={showPrintConfirm}
                onClose={() => setShowPrintConfirm(false)}
                onConfirm={confirmPrint}
                title="تأكيد طباعة الفاكسات"
                message="هل أنت متأكد من طباعة الفاكسات المحددة؟"
                itemCount={`${selectedFaxes.size} فاكس`}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="تأكيد حذف الفاكسات"
                message="هل أنت متأكد من حذف الفاكسات المحددة؟"
                itemCount={`${selectedFaxes.size} فاكس`}
                warningNote="سيتم حذف الفاكسات نهائياً ولا يمكن التراجع عن هذا الإجراء"
            />
        </div>
    );
}

function App() {
    return (
        <ToastProvider>
            <SettingsProvider>
                <AppStateProvider>
                    <ModalStackProvider>
                        <AppContent />
                    </ModalStackProvider>
                </AppStateProvider>
            </SettingsProvider>
        </ToastProvider>
    );
}

export default App;
