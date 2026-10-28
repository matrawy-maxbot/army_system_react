import React, { useState } from 'react';
import { AppStateProvider } from './context/AppStateContext';
import { SettingsProvider } from './context/SettingsContext';
import TitleBar from './components/layout/TitleBar';
import Header from './components/layout/Header';

function App() {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <SettingsProvider>
            <AppStateProvider>
                <div className="app" dir="rtl">
                    <TitleBar />
                    <Header onSettingsClick={() => setShowSettings(true)} />
                    
                    <main className="app-content">
                        <div className="welcome-message">
                            <h2>🎉 مرحباً بك في النسخة الجديدة</h2>
                            <p>تم إعداد المشروع بنجاح باستخدام React + Electron</p>
                            
                            <div className="features-list">
                                <h3>✅ ما تم إنجازه:</h3>
                                <ul>
                                    <li>✅ إعداد البنية الأساسية للمشروع</li>
                                    <li>✅ تكامل React 18.2.0 مع Electron 22.3.27</li>
                                    <li>✅ دعم RTL والعربية الكامل</li>
                                    <li>✅ Custom Title Bar مع قائمة الاختصارات</li>
                                    <li>✅ Context لإدارة الحالة (AppState)</li>
                                    <li>✅ Context لإدارة الإعدادات (Settings)</li>
                                    <li>✅ نسخ جميع الأصول (خطوط، أيقونات، إيموجي)</li>
                                    <li>✅ إعداد CSS Variables والأنماط الأساسية</li>
                                </ul>
                                
                                <h3>🔄 الخطوات التالية:</h3>
                                <ul>
                                    <li>⏳ بناء مكونات الواجهة الأساسية</li>
                                    <li>⏳ نقل منطق التطبيق من المشروع القديم</li>
                                    <li>⏳ إنشاء نظام الفئات والمستندات</li>
                                    <li>⏳ إنشاء نظام الفاكسات</li>
                                </ul>
                            </div>
                            
                            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
                                <strong>ملاحظة:</strong> المشروع جاهز للتطوير الكامل. جميع البنية الأساسية معدة وجاهزة.
                            </div>
                        </div>
                    </main>
                </div>
            </AppStateProvider>
        </SettingsProvider>
    );
}

export default App;
