import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!password.trim()) {
            setMessage('يرجى إدخال كلمة المرور');
            return;
        }

        // الانتقال مباشرة إلى الصفحة الرئيسية
        if (onLogin) {
            onLogin(password);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-page">
                <main className="main-content">
                    <section className="visual-panel">
                        <div className="visual-copy">
                            <div className="eyebrow">إدارة متكاملة لسير العمل</div>
                            <h1>من الفاكس إلى الأرشيف،<br/>كل شيء تحت السيطرة.</h1>
                            <p>نظام متكامل لمعالجة الفاكسات وتنظيم المستندات وإدارة الردود والتذكيرات والمهام، في مساحة عمل واحدة.</p>
                            <div className="feature-row">
                                <span className="feature">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/>
                                    </svg>
                                    معالجة الفاكسات
                                </span>
                                <span className="feature">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 5h16v14H4zM8 9h8M8 13h5"/>
                                    </svg>
                                    الردود والقوالب
                                </span>
                                <span className="feature">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="17" rx="2"/>
                                        <path d="M8 2v4M16 2v4M3 9h18"/>
                                    </svg>
                                    المهام والتذكيرات
                                </span>
                                <span className="feature">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 7h18v14H3zM3 7l3-4h12l3 4"/>
                                    </svg>
                                    الأرشيف والمجلدات
                                </span>
                            </div>
                        </div>

                        <div className="dashboard-wrap">
                            <div className="dashboard">
                                <div className="dash-top">
                                    <div className="dash-brand">
                                        <span className="dash-logo">▤</span>
                                        إدارة الفاكسات والتدريب
                                    </div>
                                    <div className="dash-tools">
                                        <i className="dash-tool"></i>
                                        <i className="dash-tool"></i>
                                        <i className="dash-tool"></i>
                                        <i className="dash-tool"></i>
                                    </div>
                                </div>
                                <div className="dash-layout">
                                    <div className="dash-nav">
                                        <span className="nav-icon active">⌂</span>
                                        <span className="nav-icon">▣</span>
                                        <span className="nav-icon">♧</span>
                                        <span className="nav-icon">✓</span>
                                        <span className="nav-icon">▤</span>
                                        <span className="nav-icon">▣</span>
                                    </div>
                                    <div className="dash-main">
                                        <div className="dash-heading">
                                            <div>
                                                <strong>الرئيسية</strong><br/>
                                                <span>إدارة الفاكسات والردود والمتابعة</span>
                                            </div>
                                            <span className="upload-btn">+ رفع فاكس أصلي</span>
                                        </div>
                                        <div className="login-workflow">
                                            <div className="login-workflow-title">مسار معالجة الفاكس</div>
                                            <div className="login-steps">
                                                <div className="login-step">
                                                    <span className="login-step-circle login-step-done">✓</span>
                                                    <span className="login-step-label">رفع الفاكس</span>
                                                </div>
                                                <i className="login-step-line"></i>
                                                <div className="login-step">
                                                    <span className="login-step-circle login-step-current">2</span>
                                                    <span className="login-step-label">فلترة الصفحات</span>
                                                </div>
                                                <i className="login-step-line"></i>
                                                <div className="login-step">
                                                    <span className="login-step-circle">3</span>
                                                    <span className="login-step-label">الردود</span>
                                                </div>
                                                <i className="login-step-line"></i>
                                                <div className="login-step">
                                                    <span className="login-step-circle">4</span>
                                                    <span className="login-step-label">التذكيرات</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="login-fax-title">
                                            الفاكسات 
                                            <span style={{fontSize: '7px', color: '#91a0b5', fontWeight: 400}}> · 3 عناصر</span>
                                        </div>
                                        <div className="login-fax-cards">
                                            <div className="login-fax-card">
                                                <div className="login-fax-thumb">
                                                    <div className="login-paper">
                                                        <i></i><i></i><i></i><i></i>
                                                    </div>
                                                </div>
                                                <div className="login-fax-info">
                                                    <b>الفاكس الأصلي</b>
                                                    <span>PDF · 3 صفحات</span>
                                                </div>
                                            </div>
                                            <div className="login-fax-card">
                                                <div className="login-fax-thumb">
                                                    <div className="login-paper">
                                                        <i></i><i></i><i></i><i></i>
                                                    </div>
                                                </div>
                                                <div className="login-fax-info">
                                                    <b>فاكس 1</b>
                                                    <span>صفحة واحدة · مفلتر</span>
                                                </div>
                                            </div>
                                            <div className="login-fax-card">
                                                <div className="login-fax-thumb">
                                                    <div className="login-paper">
                                                        <i></i><i></i><i></i><i></i>
                                                    </div>
                                                </div>
                                                <div className="login-fax-info">
                                                    <b>فاكس 2</b>
                                                    <span>صفحة واحدة · مفلتر</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <aside className="dash-side">
                                        <div className="login-side-head">
                                            التذكيرات 
                                            <span className="login-count">4</span>
                                        </div>
                                        <div className="login-reminder">
                                            <div className="login-reminder-top">
                                                <b>مراجعة الرد</b>
                                                <span className="login-status">قريبًا</span>
                                            </div>
                                            <small>اليوم · 10:30 ص</small>
                                        </div>
                                        <div className="login-reminder">
                                            <div className="login-reminder-top">
                                                <b>متابعة المعاملة</b>
                                                <span className="login-status">نشط</span>
                                            </div>
                                            <small>غدًا · 09:00 ص</small>
                                        </div>
                                        <div className="login-side-head login-task-head">
                                            المهام 
                                            <span className="login-count">3</span>
                                        </div>
                                        <div className="login-task">
                                            <i className="login-check login-check-done">✓</i>
                                            مراجعة الفاكس
                                        </div>
                                        <div className="login-task">
                                            <i className="login-check"></i>
                                            تجهيز الرد
                                        </div>
                                        <div className="login-task">
                                            <i className="login-check"></i>
                                            أرشفة المستند
                                        </div>
                                    </aside>
                                </div>
                            </div>
                        </div>

                        <div className="visual-foot">
                            <span className="shield">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>
                                    <path d="m9 12 2 2 4-4"/>
                                </svg>
                            </span>
                            <span>كل أدوات العمل الأساسية في واجهة واحدة</span>
                        </div>
                    </section>

                    <section className="login-panel">
                        <div className="login-symbol">
                            <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <rect x="4" y="10" width="16" height="11" rx="2"/>
                                <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                                <circle cx="12" cy="15.5" r="1"/>
                            </svg>
                        </div>
                        <div className="overline">مرحباً بعودتك</div>
                        <h2>تسجيل الدخول</h2>
                        <p className="description">أدخل كلمة المرور للمتابعة إلى مساحة العمل الخاصة بك.</p>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="password">كلمة المرور</label>
                            <div className="password-wrap">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="أدخل كلمة المرور"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    className="toggle"
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                                >
                                    {showPassword ? (
                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                            <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
                                            <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.2 0 9.5 7 9.5 7a15 15 0 0 1-3.1 3.8M6.2 6.2C3.8 7.8 2.5 12 2.5 12s3.3 7 9.5 7c1 0 2-.2 2.8-.5"/>
                                        </svg>
                                    ) : (
                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                            <path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z"/>
                                            <circle cx="12" cy="12" r="2.5"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="hint">تأكد من إدخال كلمة المرور بشكل صحيح.</div>
                            
                            <button className="submit" type="submit">
                                <span>الدخول إلى النظام</span>
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M13 6l6 6-6 6"/>
                                </svg>
                            </button>
                            
                            {message && (
                                <div className={`message ${message.includes('نجاح') ? 'success' : ''}`}>
                                    {message}
                                </div>
                            )}
                        </form>

                        <div className="divider"></div>
                        <div className="login-bottom">
                            <span>© 2026 نظام إدارة الفاكسات</span>
                            <span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>
                                </svg>
                                دخول محمي
                            </span>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default LoginPage;
