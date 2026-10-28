import React, { useState } from 'react';
import { AppStateProvider } from './context/AppStateContext';
import { SettingsProvider } from './context/SettingsContext';
import { TitleBar, Header, Sidebar, TabBar, Footer } from './components/layout';
import { OriginalFaxSection, FaxGrid, UploadFaxModal, FilterFaxModal } from './components/faxes';
import { FilesList } from './components/files';
import { RemindersList } from './components/reminders';
import { ListsView } from './components/lists';
import { TemplatesView } from './components/templates';
import { SettingsModal } from './components/settings';
import { CategoryGrid, AddCategoryModal, EditCategoryModal } from './components/categories';
import './styles/files.css';

function App() {
    // Modal states
    const [showSettings, setShowSettings] = useState(false);
    const [showUploadFax, setShowUploadFax] = useState(false);
    const [showFilterFax, setShowFilterFax] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    
    // Section state - حالة التبديل بين الأقسام
    const [activeSection, setActiveSection] = useState('main');

    const handleUpload = async (uploadData) => {
        const { type, pdf, images } = uploadData;
        
        // TODO: Implement actual file upload logic
        console.log('Upload data:', uploadData);
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

    return (
        <SettingsProvider>
            <AppStateProvider>
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
                                    {/* Add New Category Button */}
                                    <div className="add-category-section">
                                        <button className="btn-add-category" onClick={() => setShowAddCategory(true)}>
                                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1" />
                                            </svg>
                                            إضافة فئة جديدة
                                        </button>
                                    </div>

                                    <div className="search-box">
                                        <input type="text" id="searchInput" placeholder="بحث في المستندات..." />
                                    </div>
                                </div>

                                <div className="filters-view-container">
                                    <div className="sort-view-container">
                                        <button className="btn-icon-small" id="refreshFilesBtn" title="تحديث قائمة الملفات">
                                            <div className="square"></div>
                                            <div className="square"></div>
                                            <div className="square"></div>
                                            <div className="square"></div>
                                        </button>
                                        <button className="btn-icon-small list" id="openCopiesFolder" title="فتح مجلد اليوم">
                                            <div className="shape">
                                                <div className="square"></div>
                                                <div className="line"></div>
                                            </div>
                                            <div className="shape">
                                                <div className="square"></div>
                                                <div className="line"></div>
                                            </div>
                                            <div className="shape">
                                                <div className="square"></div>
                                                <div className="line"></div>
                                            </div>
                                        </button>
                                        <select id="sortOrder" className="filter-select">
                                            <option value="time-desc">الأحدث أولاً</option>
                                            <option value="time-asc">الأقدم أولاً</option>
                                            <option value="alpha-asc">أ - ي</option>
                                            <option value="alpha-desc">ي - أ</option>
                                        </select>
                                        <select id="category-filter" className="filter-select">
                                            <option value="weapons-faxes">أسلحة</option>
                                            <option value="power-faxes">قوة اللواء</option>
                                            <option value="vichles-faxes">مركبات</option>
                                        </select>
                                    </div>
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

                                {/* Categories Grid */}
                                <CategoryGrid 
                                    onEditCategory={(category) => setEditingCategory(category)}
                                    onAddDocument={(category) => {
                                        // TODO: Implement add document
                                        console.log('Add document to category:', category);
                                    }}
                                />

                                {/* قسم الفاكس الأصلي */}
                                <OriginalFaxSection 
                                    onUploadClick={() => setShowUploadFax(true)}
                                    onEditClick={() => setShowUploadFax(true)}
                                    onDeleteClick={async () => {
                                        // TODO: Implement delete logic
                                        console.log('Delete fax');
                                    }}
                                    onFilterClick={() => setShowFilterFax(true)}
                                />

                                {/* قسم الفاكسات المفلترة */}
                                <FaxGrid />
                            </>
                        )}

                        {/* قسم القوالب */}
                        {activeSection === 'templates' && <TemplatesView />}

                        {/* قسم التذكيرات */}
                        {activeSection === 'reminders' && <RemindersList />}

                        {/* قسم القوائم */}
                        {activeSection === 'lists' && <ListsView />}
                    </main>
                    
                    {/* نظام الملفات اليومية */}
                    <FilesList />
                    
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

                    <SettingsModal 
                        isOpen={showSettings}
                        onClose={() => setShowSettings(false)}
                    />

                    <AddCategoryModal 
                        isOpen={showAddCategory}
                        onClose={() => setShowAddCategory(false)}
                    />

                    {editingCategory && (
                        <EditCategoryModal 
                            category={editingCategory}
                            onClose={() => setEditingCategory(null)}
                        />
                    )}
                </div>
            </AppStateProvider>
        </SettingsProvider>
    );
}

export default App;
