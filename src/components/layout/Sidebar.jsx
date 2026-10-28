import React from 'react';

function Sidebar() {
    return (
        <aside className="sidebar" id="todayFilesSidebar">
            <div className="sidebar-header">
                <h2>ما تم إنجازه اليوم <span id="filesCount" className="files-count">(0)</span></h2>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn-icon-small" id="refreshFilesBtn" title="تحديث قائمة الملفات">
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                        </svg>
                    </button>
                    <button className="btn-icon-small" id="openCopiesFolder" title="فتح مجلد اليوم">
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* فلترة التاريخ */}
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
            
            {/* شريط البحث والفلترة */}
            <div className="search-filter-container">
                <div className="search-box">
                    <input type="text" id="searchInput" placeholder="بحث في المستندات..." />
                </div>
                <div className="filter-controls">
                    <select id="categoryFilter" className="filter-select">
                        <option value="all">كل الفئات</option>
                    </select>
                    <select id="sortOrder" className="filter-select">
                        <option value="time-desc">الأحدث أولاً</option>
                        <option value="time-asc">الأقدم أولاً</option>
                        <option value="alpha-asc">أ - ي</option>
                        <option value="alpha-desc">ي - أ</option>
                    </select>
                </div>
            </div>
            
            {/* شريط أدوات التحديد */}
            <div className="selection-toolbar" id="selectionToolbar" style={{ display: 'none' }}>
                <div className="selection-info">
                    <span id="selectedCount">0</span> محدد
                </div>
                <div className="selection-actions">
                    <button className="btn-toolbar" id="selectAllBtn" title="تحديد الكل">
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                        </svg>
                        الكل
                    </button>
                    <button className="btn-toolbar" id="deselectAllBtn" title="إلغاء التحديد">
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />
                        </svg>
                        إلغاء
                    </button>
                    <button className="btn-toolbar btn-toolbar-print" id="printSelectedBtn" title="طباعة المحدد">
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                            <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                            <path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4" />
                        </svg>
                        طباعة
                    </button>
                    <button className="btn-toolbar btn-toolbar-merge" id="mergeSelectedBtn" title="دمج الملفات المحددة" style={{ display: 'none' }}>
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1.586l5.293 -5.293a1 1 0 0 1 1.32 -.083l.094 .083a1 1 0 0 1 0 1.414l-5.293 5.293h1.586a1 1 0 0 1 .117 1.993l-.117 .007h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-4a1 1 0 0 1 1 -1m0 12a1 1 0 0 1 .993 .883l.007 .117v4a1 1 0 0 1 -.883 .993l-.117 .007h-4a1 1 0 0 1 -.117 -1.993l.117 -.007h1.586l-5.293 5.293a1 1 0 0 1 -1.414 0a1 1 0 0 1 -.083 -1.32l.083 -.094l5.293 -5.293v-1.586a1 1 0 0 1 1 -1" />
                        </svg>
                        دمج
                    </button>
                    <button className="btn-toolbar btn-toolbar-delete" id="deleteSelectedBtn" title="حذف المحدد">
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1" />
                            <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z" />
                        </svg>
                        حذف
                    </button>
                </div>
            </div>
            
            <div className="sidebar-content" id="todayFilesList">
                {/* Today's files will be inserted here */}
            </div>
        </aside>
    );
}

export default Sidebar;
