import React from 'react';

function TabBar() {
    return (
        <aside className="app-sidebar">
            <button className="sidebar-btn active" data-section="main" title="الصفحة الرئيسية">
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.707 2.293l9 9c.63 .63 .184 1.707 -.707 1.707h-1v6a3 3 0 0 1 -3 3h-1v-7a3 3 0 0 0 -2.824 -2.995l-.176 -.005h-2a3 3 0 0 0 -3 3v7h-1a3 3 0 0 1 -3 -3v-6h-1c-.89 0 -1.337 -1.077 -.707 -1.707l9 -9a1 1 0 0 1 1.414 0m.293 11.707a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883 -.993l.117 -.007z" />
                </svg>
                <span>الرئيسية</span>
            </button>
            <button className="sidebar-btn" data-section="templates" title="القوالب">
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h14zm-14 2a1 1 0 0 0 -.993 .883l-.007 .117v12a1 1 0 0 0 .883 .993l.117 .007h6v-14h-6zm14 0h-6v14h6a1 1 0 0 0 .993 -.883l.007 -.117v-12a1 1 0 0 0 -.883 -.993l-.117 -.007z" />
                </svg>
                <span>القوالب</span>
            </button>
            <button className="sidebar-btn" data-section="reminders" title="التذكيرات">
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"/>
                    <path d="M9 17v1a3 3 0 0 0 6 0v-1"/>
                </svg>
                <span>التذكيرات</span>
            </button>
            <button className="sidebar-btn" data-section="lists" title="القوائم">
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"/>
                    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"/>
                    <path d="M9 12l2 2l4 -4"/>
                </svg>
                <span>القوائم</span>
            </button>
        </aside>
    );
}

export default TabBar;
