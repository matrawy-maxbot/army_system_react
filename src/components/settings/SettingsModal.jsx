import React, { useState, useEffect } from 'react';
import ModalPortal from '../common/ModalPortal';
import DateFormatModal from './DateFormatModal';
import settingsAPI from '../../services/settingsAPI';
import './settings.css';

const SettingsModal = ({ isOpen, onClose }) => {
    // State للإعدادات الأساسية
    const [settings, setSettings] = useState({
        save_path: '',
        folder_pattern: 'YYYY-MM-DD',
        auto_backup: true,
        backup_interval: 'daily',
        theme: 'light',
        language: 'ar',
        font_size: 'medium',
        notifications_enabled: true
    });
    
    // State للواجهة
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [pathPreview, setPathPreview] = useState('');
    const [showDateFormatModal, setShowDateFormatModal] = useState(false);
    
    // Legacy states (نبقيها للتوافق مع DateFormatModal)
    const [customPattern, setCustomPattern] = useState('');

    // تحميل الإعدادات عند فتح النافذة
    useEffect(() => {
        if (isOpen) {
            loadSettings();
        }
    }, [isOpen]);

    // تحديث المعاينة عند تغيير المسار أو النمط
    useEffect(() => {
        updatePathPreview();
    }, [settings.save_path, settings.folder_pattern]);

    /**
     * تحميل الإعدادات من الـ Backend
     */
    const loadSettings = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // استخدام الـ API الجديد (يختار تلقائياً بين Electron و Mock)
            const result = await settingsAPI.getAll();
            
            if (result.success) {
                setSettings({
                    save_path: result.data.save_path || '',
                    folder_pattern: result.data.folder_pattern || 'YYYY-MM-DD',
                    auto_backup: result.data.auto_backup ?? true,
                    backup_interval: result.data.backup_interval || 'daily',
                    theme: result.data.theme || 'light',
                    language: result.data.language || 'ar',
                    font_size: result.data.font_size || 'medium',
                    notifications_enabled: result.data.notifications_enabled ?? true
                });
                console.log('✅ Settings loaded successfully', result.data);
                console.log('🔧 Running in:', settingsAPI.getCurrentMode(), 'mode');
            } else {
                throw new Error(result.error || 'فشل تحميل الإعدادات');
            }
        } catch (err) {
            console.error('❌ Error loading settings:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * تصفح المجلدات
     */
    const browseSavePath = async () => {
        // التحقق من وجود Electron API
        if (!window.electronAPI) {
            alert('⚠️ اختيار المجلدات متاح فقط في نسخة Electron\n\nيمكنك إدخال المسار يدويًا في وضع المتصفح للاختبار.');
            return;
        }
        
        try {
            const result = await window.electronAPI.selectFolder('اختر مجلد حفظ المستندات');
            
            if (result.success && !result.canceled) {
                setSettings(prev => ({ ...prev, save_path: result.folderPath }));
            }
        } catch (err) {
            console.error('Error selecting folder:', err);
        }
    };

    /**
     * تحديث المعاينة
     */
    const updatePathPreview = async () => {
        if (!settings.save_path) {
            setPathPreview('الرجاء اختيار مسار الحفظ');
            return;
        }
        
        try {
            // استخدام الـ API الجديد
            const result = await settingsAPI.getFormattedPath('example.pdf');
            
            if (result.success) {
                setPathPreview(result.data.fullPath);
            } else {
                setPathPreview('خطأ في تنسيق المسار');
            }
        } catch (err) {
            console.error('Error updating path preview:', err);
            setPathPreview('خطأ في المعاينة');
        }
    };

    /**
     * تنسيق التاريخ (للمعاينة في وضع المتصفح)
     */
    const formatDateByPattern = (date, pattern) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        switch (pattern) {
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'YYYY-MM':
                return `${year}-${month}`;
            case 'YYYY':
                return `${year}`;
            case 'YYYY/MM/DD':
                return `${year}/${month}/${day}`;
            case 'YYYY/MM':
                return `${year}/${month}`;
            default:
                return `${year}-${month}-${day}`;
        }
    };

    /**
     * الحصول على اسم عرض النمط
     */
    const getFormatDisplayName = (format) => {
        const names = {
            'YYYY-MM-DD': 'سنة-شهر-يوم (2026-11-12)',
            'YYYY-MM': 'سنة-شهر (2026-11)',
            'YYYY': 'السنة فقط (2026)',
            'YYYY/MM/DD': 'سنة/شهر/يوم (2026/11/12)',
            'YYYY/MM': 'سنة/شهر (2026/11)'
        };
        return names[format] || format;
    };

    /**
     * معالج تغيير نمط التاريخ
     */
    const handleDateFormatSave = (newFormat) => {
        setSettings(prev => ({ ...prev, folder_pattern: newFormat }));
        setShowDateFormatModal(false);
    };

    /**
     * حفظ الإعدادات
     */
    const handleSave = async () => {
        if (!settings.save_path) {
            alert('الرجاء اختيار مسار الحفظ');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // التحقق من صلاحية المسار
            const validation = await settingsAPI.validatePath(settings.save_path);

            if (!validation.valid) {
                alert('المسار المحدد غير صالح أو لا يمكن الكتابة فيه. الرجاء اختيار مسار آخر.');
                return;
            }

            // حفظ الإعدادات
            const result = await settingsAPI.updateMultiple(settings);

            if (result.success) {
                console.log('✅ Settings saved successfully');
                alert('✅ تم حفظ الإعدادات بنجاح');
                
                // تحديث الـ state بالبيانات المحفوظة
                setSettings(result.data);
                
                onClose();
            } else {
                throw new Error(result.error || 'فشل حفظ الإعدادات');
            }
        } catch (err) {
            console.error('❌ Error saving settings:', err);
            setError(err.message);
            alert('❌ فشل حفظ الإعدادات: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    /**
     * معالج تغيير قيمة الإعداد
     */
    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (!isOpen) return null;

    return (
        <ModalPortal>
            <>
                <div className="modal active" onClick={onClose}>
                    <div className="modal-content modal-small" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: '-0.2em' }}>
                                    <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
                                </svg>
                                إعدادات التطبيق
                            </h2>
                            <button className="btn-close" onClick={onClose}>
                                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            {loading ? (
                                <div className="loading-container">
                                    <p>جاري تحميل الإعدادات...</p>
                                </div>
                            ) : (
                                <form id="settingsForm">
                                    {error && (
                                        <div className="error-message" style={{ marginBottom: '15px', padding: '10px', background: '#ffebee', border: '1px solid #f44336', borderRadius: '4px', color: '#c62828' }}>
                                            ❌ {error}
                                        </div>
                                    )}

                                    {/* مسار الحفظ */}
                                    <div className="form-group">
                                        <label>مسار حفظ المستندات</label>
                                        <div className="path-input-wrapper">
                                            <input 
                                                type="text" 
                                                id="savePathInput"
                                                value={settings.save_path}
                                                onChange={(e) => handleChange('save_path', e.target.value)}
                                                readOnly={!!window.electronAPI}
                                                placeholder={window.electronAPI ? "اختر مجلد الحفظ..." : "أدخل مسار المجلد (وضع المتصفح)"}
                                            />
                                            <button type="button" className="btn-browse" onClick={browseSavePath}>
                                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                                                </svg>
                                                استعراض
                                            </button>
                                        </div>
                                        <small>
                                            {window.electron 
                                                ? 'المجلد الذي سيتم حفظ الملفات فيه مع تنظيم تلقائي حسب التاريخ'
                                                : '⚠️ وضع المتصفح: استعراض المجلدات متاح في نسخة Electron فقط'
                                            }
                                        </small>
                                    </div>
                                    
                                    {/* نمط تنظيم المجلدات */}
                                    <div className="form-group">
                                        <label>نمط تنظيم المجلدات حسب التاريخ</label>
                                        <div className="format-selector-box">
                                            <div className="format-current">
                                                <div className="format-info">
                                                    <span className="format-label">النمط الحالي:</span>
                                                    <span className="format-value">{getFormatDisplayName(settings.folder_pattern)}</span>
                                                </div>
                                            </div>
                                            <select 
                                                value={settings.folder_pattern}
                                                onChange={(e) => handleChange('folder_pattern', e.target.value)}
                                                style={{ width: '100%', padding: '8px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                            >
                                                <option value="YYYY-MM-DD">سنة-شهر-يوم (2026-11-12)</option>
                                                <option value="YYYY-MM">سنة-شهر (2026-11)</option>
                                                <option value="YYYY">السنة فقط (2026)</option>
                                                <option value="YYYY/MM/DD">سنة/شهر/يوم (2026/11/12)</option>
                                                <option value="YYYY/MM">سنة/شهر (2026/11)</option>
                                            </select>
                                        </div>
                                        <small>يحدد طريقة تنظيم المجلدات الفرعية حسب التاريخ</small>
                                    </div>
                                
                                    {/* معاينة المسار */}
                                    <div className="form-group">
                                        <label>معاينة المسار الناتج</label>
                                        <div className="path-preview" id="pathPreview">
                                            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                                            </svg>
                                            <span id="pathPreviewText">{pathPreview}</span>
                                        </div>
                                        <small>مثال على المسار الكامل الذي سيتم استخدامه عند حفظ الملفات</small>
                                    </div>

                                    {/* فاصل */}
                                    <div className="settings-divider"></div>

                                    {/* النسخ الاحتياطي */}
                                    <div className="settings-section">
                                        <div className="setting-label">
                                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2a5 5 0 0 1 4.995 4.783l.005 .217v.126a7 7 0 0 1 5.98 5.967l.015 .24l.005 .217a7 7 0 0 1 -7 7h-9a5 5 0 0 1 -5 -5l.005 -.217a5 5 0 0 1 4.995 -4.783v-.126a5 5 0 0 1 5 -5" />
                                            </svg>
                                            النسخ الاحتياطي التلقائي
                                        </div>
                                        
                                        <div className="toggle-container">
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.auto_backup}
                                                    onChange={(e) => handleChange('auto_backup', e.target.checked)}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                            <span className="toggle-label">
                                                {settings.auto_backup ? 'مُفعّل' : 'غير مُفعّل'}
                                            </span>
                                        </div>

                                        {settings.auto_backup && (
                                            <div className="form-group" style={{ marginTop: '15px' }}>
                                                <label>تكرار النسخ الاحتياطي</label>
                                                <select 
                                                    value={settings.backup_interval}
                                                    onChange={(e) => handleChange('backup_interval', e.target.value)}
                                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                                >
                                                    <option value="hourly">كل ساعة</option>
                                                    <option value="daily">يومياً</option>
                                                    <option value="weekly">أسبوعياً</option>
                                                    <option value="monthly">شهرياً</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* فاصل */}
                                    <div className="settings-divider"></div>

                                    {/* المظهر واللغة */}
                                    <div className="settings-section">
                                        <div className="setting-label">
                                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0 -20m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0 -16m0 3a5 5 0 0 1 5 5v1a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-1a3 3 0 1 0 -6 0v1a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-1a5 5 0 0 1 5 -5" />
                                            </svg>
                                            المظهر والواجهة
                                        </div>

                                        <div className="form-group">
                                            <label>المظهر</label>
                                            <select 
                                                value={settings.theme}
                                                onChange={(e) => handleChange('theme', e.target.value)}
                                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                            >
                                                <option value="light">فاتح</option>
                                                <option value="dark">داكن</option>
                                                <option value="auto">تلقائي</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>اللغة</label>
                                            <select 
                                                value={settings.language}
                                                onChange={(e) => handleChange('language', e.target.value)}
                                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                            >
                                                <option value="ar">العربية</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>حجم الخط</label>
                                            <select 
                                                value={settings.font_size}
                                                onChange={(e) => handleChange('font_size', e.target.value)}
                                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                            >
                                                <option value="small">صغير</option>
                                                <option value="medium">متوسط</option>
                                                <option value="large">كبير</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* فاصل */}
                                    <div className="settings-divider"></div>

                                    {/* الإشعارات */}
                                    <div className="settings-section">
                                        <div className="setting-label">
                                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M10 2a2 2 0 0 1 2 2v1a7 7 0 0 1 6 7v5.993a1 1 0 0 0 1.993 .117l.007 -.11a1 1 0 0 1 2 0a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3a1 1 0 0 1 2 0a1 1 0 0 0 1 1h1v-5.993a7 7 0 0 1 6 -7v-1a2 2 0 0 1 2 -2m0 2v1a1 1 0 0 1 -1 1a5 5 0 0 0 -5 5v6h12v-6a5 5 0 0 0 -5 -5a1 1 0 0 1 -1 -1zm-2 18a2 2 0 1 0 4 0" />
                                            </svg>
                                            الإشعارات
                                        </div>
                                        
                                        <div className="toggle-container">
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.notifications_enabled}
                                                    onChange={(e) => handleChange('notifications_enabled', e.target.checked)}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                            <span className="toggle-label">
                                                {settings.notifications_enabled ? 'مُفعّلة' : 'غير مُفعّلة'}
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn-secondary" 
                                onClick={onClose}
                                disabled={saving}
                            >
                                إلغاء
                            </button>
                            <button 
                                type="button" 
                                className="btn-primary" 
                                onClick={handleSave}
                                disabled={loading || saving}
                            >
                                {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Date Format Modal */}
                {showDateFormatModal && (
                    <DateFormatModal
                        isOpen={showDateFormatModal}
                        onClose={() => setShowDateFormatModal(false)}
                        currentFormat={settings.folder_pattern}
                        customPattern={customPattern}
                        onSave={handleDateFormatSave}
                    />
                )}
            </>
        </ModalPortal>
    );
};

export default SettingsModal;
