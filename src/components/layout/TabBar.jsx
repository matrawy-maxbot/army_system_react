import React from 'react';

function TabBar({ onSectionChange, activeSection }) {
    const handleButtonClick = (section) => {
        if (onSectionChange) {
            onSectionChange(section);
        }
    };

    return (
        <aside className="app-sidebar">
            <button 
                className={`sidebar-btn ${activeSection === 'main' ? 'active' : ''}`}
                data-section="main" 
                title="الصفحة الرئيسية"
                onClick={() => handleButtonClick('main')}
            >
                <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>الرئيسية</span>
            </button>
            <button 
                className={`sidebar-btn ${activeSection === 'templates' ? 'active' : ''}`}
                data-section="templates" 
                title="القوالب"
                onClick={() => handleButtonClick('templates')}
            >
                <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span>القوالب</span>
            </button>
            <button 
                className={`sidebar-btn ${activeSection === 'reminders' ? 'active' : ''}`}
                data-section="reminders" 
                title="التذكيرات"
                onClick={() => handleButtonClick('reminders')}
            >
                <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span>التذكيرات</span>
            </button>
            <button 
                className={`sidebar-btn ${activeSection === 'tasks' ? 'active' : ''}`}
                data-section="tasks" 
                title="المهمات"
                onClick={() => handleButtonClick('tasks')}
            >
                <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                <span>المهمات</span>
            </button>
            <button 
                className={`sidebar-btn ${activeSection === 'lists' ? 'active' : ''}`}
                data-section="lists" 
                title="القوائم"
                onClick={() => handleButtonClick('lists')}
            >
                <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                <span>القوائم</span>
            </button>
            <button 
                className={`sidebar-btn ${activeSection === 'archive' ? 'active' : ''}`}
                data-section="archive" 
                title="نظام الأرشفة"
                onClick={() => handleButtonClick('archive')}
            >
                <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8v13H3V8"/>
                    <path d="M1 3h22v5H1z"/>
                    <path d="M10 12h4"/>
                </svg>
                <span>الأرشفة</span>
            </button>
            {/* الأزرار السفلية - مجموعة واحدة */}
            <div className="bottom-buttons-group">
                <button 
                    className={`sidebar-btn-icon ${activeSection === 'backup' ? 'active' : ''}`}
                    data-section="backup" 
                    title="النسخ الاحتياطية"
                    onClick={() => handleButtonClick('backup')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 18a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 8a5 5 0 0 1 0 10H6Z"/>
                    </svg>
                </button>
                <button 
                    className={`sidebar-btn-icon ${activeSection === 'tutorial' ? 'active' : ''}`}
                    data-section="tutorial" 
                    title="الدليل التعليمي"
                    onClick={() => handleButtonClick('tutorial')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </button>
                <button 
                    className="sidebar-btn-icon sidebar-btn-icon-logout"
                    data-section="logout" 
                    title="تسجيل الخروج"
                    onClick={() => handleButtonClick('login')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                </button>
            </div>
        </aside>
    );
}

export default TabBar;
