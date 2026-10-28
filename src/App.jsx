import React from 'react'

function App() {
  return (
    <div className="app" dir="rtl">
      <div className="title-bar">
        <div className="title-bar-text">نظام إدارة المستندات العسكرية</div>
        <div className="title-bar-controls">
          <button className="title-bar-button" aria-label="تصغير">─</button>
          <button className="title-bar-button" aria-label="تكبير">□</button>
          <button className="title-bar-button close" aria-label="إغلاق">×</button>
        </div>
      </div>
      
      <div className="app-container">
        <header className="app-header">
          <h1>نظام إدارة المستندات العسكرية</h1>
          <p className="subtitle">Army Document Management System</p>
        </header>
        
        <main className="app-main">
          <div className="welcome-message">
            <h2>مرحباً بك في النظام الجديد</h2>
            <p>تم إعداد البنية الأساسية للمشروع بنجاح</p>
            <ul className="features-list">
              <li>✓ React 18.2.0</li>
              <li>✓ Electron 22.3.27 (متوافق مع Windows 7)</li>
              <li>✓ Vite 4.3.9</li>
              <li>✓ دعم اللغة العربية و RTL</li>
              <li>✓ البنية الأساسية للمجلدات</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
