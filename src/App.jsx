import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { SettingsProvider } from './context/SettingsContext';
import { TitleBar, Header, Sidebar, TabBar, Footer } from './components/layout';
import { OriginalFaxSection, FaxGrid, UploadFaxModal, FilterFaxModal, DeleteFaxModal, FaxRepliesSection } from './components/faxes';
import AddToListsModal from './components/common/AddToListsModal';
// import { FilesList } from './components/files';
import { RemindersList } from './components/reminders';
import { ListsView } from './components/lists';
import { TemplatesView } from './components/templates';
import { SettingsModal } from './components/settings';

import ArchivePage from './pages/ArchivePage';
import './styles/files.css';

function AppContent() {
    const { updateState, appState } = useAppState();
    
    // Modal states
    const [showSettings, setShowSettings] = useState(false);
    const [showUploadFax, setShowUploadFax] = useState(false);
    const [showFilterFax, setShowFilterFax] = useState(false);
    const [showDeleteFax, setShowDeleteFax] = useState(false);
    const [showAddToLists, setShowAddToLists] = useState(false);
    const [itemToAddToLists, setItemToAddToLists] = useState(null);
    
    // Section state - حالة التبديل بين الأقسام
    const [activeSection, setActiveSection] = useState('main');

    const handleUpload = async (uploadData) => {
        const { type, pdf, images } = uploadData;
        
        console.log('Upload data:', uploadData);
        
        // إنشاء الفاكس الأصلي
        let originalFax;
        let faxPages = [];
        
        if (type === 'pdf' && pdf) {
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

    return (
        <div className="app" dir="rtl">
            <TitleBar />
            <Header onSettingsClick={() => setShowSettings(true)} />
            <TabBar onSectionChange={handleSectionChange} activeSection={activeSection} />
            <Sidebar />
            
            <main className="container">
                {/* قسم الصفحة الرئيسية - الفئات والفاكسات */}
                {activeSection === 'main' && (
                    <>
                        <div className="container-header">
                            <div className="search-box">
                                <input type="text" id="searchInput" placeholder="بحث في المستندات..." />
                            </div>
                        </div>

                        <div className="filters-view-container">
                            <div className="filters-container">
                                <div className="date-filter-container">
                                    <label htmlFor="dateFilter" className="date-filter-label">
                                        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" />
                                            <path d="M16 3v4" />
                                            <path d="M8 3v4" />
                                            <path d="M4 11h16" />
                                            <path d="M11 15h1" />
                                            <path d="M12 15v3" />
                                        </svg>
                                        اختر التاريخ:
                                    </label>
                                    <input type="date" id="dateFilter" className="date-filter-input" />
                                    <button className="btn-reset-date" id="resetDateBtn" title="العودة لتاريخ اليوم">اليوم</button>
                                </div>
                            </div>
                        </div>

                        {/* قسم الفاكس الأصلي */}
                        <OriginalFaxSection 
                            onUploadClick={() => setShowUploadFax(true)}
                            onEditClick={() => setShowUploadFax(true)}
                            onDeleteClick={() => setShowDeleteFax(true)}
                            onFilterClick={() => setShowFilterFax(true)}
                            onAddToLists={() => {
                                if (appState.originalFax) {
                                    handleAddToLists({
                                        type: 'originalFax',
                                        id: appState.originalFax.id,
                                        fileName: appState.originalFax.fileName
                                    });
                                }
                            }}
                        />

                        {/* قسم الفاكسات المفلترة */}
                        <FaxGrid onAddToLists={handleAddToLists} />

                        {/* قسم الردود على الفاكسات */}
                        <FaxRepliesSection />
                    </>
                )}

                {/* قسم القوالب */}
                {activeSection === 'templates' && <TemplatesView />}

                {/* قسم التذكيرات */}
                {activeSection === 'reminders' && <RemindersList />}

                {/* قسم القوائم */}
                {activeSection === 'lists' && <ListsView />}

                {/* قسم الأرشفة */}
                {activeSection === 'archive' && <ArchivePage />}
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
        </div>
    );
}

function App() {
    return (
        <SettingsProvider>
            <AppStateProvider>
                <AppContent />
            </AppStateProvider>
        </SettingsProvider>
    );
}

export default App;
