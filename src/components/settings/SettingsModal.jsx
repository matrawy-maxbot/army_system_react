import React, { useState, useEffect } from 'react';
import { settingsAPI, fileAPI } from '../../services/electronAPI';
import './settings.css';

const SettingsModal = ({ isOpen, onClose }) => {
    const [savePath, setSavePath] = useState('');
    const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');
    const [customPattern, setCustomPattern] = useState('');
    const [pathPreview, setPathPreview] = useState('');

    // تحميل الإعدادات عند فتح النافذة
    useEffect(() => {
        if (isOpen) {
            loadSettings();
        }
    }, [isOpen]);

    // تحديث المعاينة عند تغيير أي قيمة
    useEffect(() => {
        updatePathPreview();
    }, [savePath, dateFormat, customPattern]);

    const loadSettings = async () => {
        try {
            const result = await settingsAPI.loadSettings();
            if (result.success && result.settings) {
                setSavePath(result.settings.savePath || '');
                setDateFormat(result.settings.dateFormat || 'DD-MM-YYYY');
                setCustomPattern(result.settings.customPattern || '');
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const browseSavePath = async () => {
        const result = await fileAPI.selectFolder('اختر مجلد حفظ المستندات');
        
        if (result.success && !result.canceled) {
            setSavePath(result.folderPath);
        }
    };

    const formatDateByPattern = (date, pattern, customPat = '') => {
        const day = String(date.getDate()).padStart(2, '0');
        const dayNoZero = String(date.getDate());
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const monthNoZero = String(date.getMonth() + 1);
        const year = date.getFullYear();
        const yearShort = String(year).slice(-2);
        
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        const monthNamesArabic = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        const monthNamesArabicShort = [
            'ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون',
            'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'
        ];
        
        const toArabicNumerals = (str) => {
            return str.split('').map(char => {
                if (char >= '0' && char <= '9') {
                    return arabicNumerals[parseInt(char)];
                }
                return char;
            }).join('');
        };
        
        const processCustomPattern = (template) => {
            let result = template;
            let convertToArabic = false;
            
            if (result.startsWith('[AR]')) {
                convertToArabic = true;
                result = result.substring(4);
            }
            
            result = result.replace(/YYYY/g, year);
            result = result.replace(/YY/g, yearShort);
            result = result.replace(/MMMM/g, monthNamesArabic[date.getMonth()]);
            result = result.replace(/MMM/g, monthNamesArabicShort[date.getMonth()]);
            result = result.replace(/MM/g, month);
            result = result.replace(/M/g, monthNoZero);
            result = result.replace(/DD/g, day);
            result = result.replace(/D/g, dayNoZero);
            
            if (convertToArabic) {
                result = toArabicNumerals(result);
            }
            
            return result;
        };
        
        if (pattern === 'CUSTOM' && customPat) {
            return processCustomPattern(customPat);
        }
        
        switch (pattern) {
            case 'YYYY/MM/DD':
                return `${year}/${month}/${day}`;
            case 'YYYY/MM-DD':
                return `${year}/${month}-${day}`;
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'DD-MM-YYYY':
                return toArabicNumerals(`${day}-${month}-${year}`);
            case 'YYYY':
                return `${year}`;
            case 'YYYY/MM':
                return `${year}/${month}`;
            default:
                return toArabicNumerals(`${day}-${month}-${year}`);
        }
    };

    const updatePathPreview = () => {
        if (!savePath) {
            setPathPreview('الرجاء اختيار المسار والنمط');
            return;
        }
        
        if (dateFormat === 'CUSTOM' && !customPattern.trim()) {
            setPathPreview('الرجاء إدخال نمط مخصص');
            return;
        }
        
        const dateFolder = formatDateByPattern(new Date(), dateFormat, customPattern);
        const fullPath = `${savePath}\\${dateFolder}`;
        setPathPreview(fullPath);
    };

    const handleSave = async () => {
        if (!savePath) {
            alert('الرجاء اختيار مسار الحفظ');
            return;
        }
        
        if (dateFormat === 'CUSTOM' && !customPattern.trim()) {
            alert('الرجاء إدخال نمط مخصص');
            return;
        }
        
        try {
            // Note: testPathWritable is not wrapped yet - keeping original implementation
            const testResult = window.electronAPI && await window.electronAPI.testPathWritable(savePath);
            if (!testResult.success) {
                alert('المسار المحدد غير صالح أو لا يمكن الكتابة فيه. الرجاء اختيار مسار آخر.');
                return;
            }
        } catch (error) {
            alert('خطأ في التحقق من المسار: ' + error.message);
            return;
        }
        
        const settings = {
            savePath,
            dateFormat,
            customPattern: dateFormat === 'CUSTOM' ? customPattern.trim() : ''
        };
        
        try {
            const result = await settingsAPI.saveSettings(settings);
            if (result.success) {
                console.log('✅ Settings saved successfully');
                onClose();
            } else {
                alert('فشل حفظ الإعدادات. الرجاء المحاولة مرة أخرى.');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('فشل حفظ الإعدادات. الرجاء المحاولة مرة أخرى.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content settings-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
                        </svg>
                        إعدادات التطبيق
                    </h2>
                    <button className="close-modal" onClick={onClose}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.3 5.71a.996.996 0 0 0 -1.41 0l-4.89 4.89l-4.89 -4.89a.996.996 0 1 0 -1.41 1.41l4.89 4.89l-4.89 4.89a.996.996 0 1 0 1.41 1.41l4.89 -4.89l4.89 4.89a.996.996 0 1 0 1.41 -1.41l-4.89 -4.89l4.89 -4.89c.38 -.38 .38 -1.02 0 -1.41z" />
                        </svg>
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="setting-group">
                        <label className="setting-label">
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                            </svg>
                            مسار حفظ المستندات
                        </label>
                        <div className="path-input-wrapper">
                            <input 
                                type="text" 
                                value={savePath}
                                readOnly
                                placeholder="اختر مجلد الحفظ"
                            />
                            <button className="btn-browse" onClick={browseSavePath}>
                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                                </svg>
                                تصفح
                            </button>
                        </div>
                    </div>
                    
                    <div className="setting-group">
                        <label className="setting-label">
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            نمط التاريخ
                        </label>
                        <div className="date-format-options">
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="dateFormat" 
                                    value="YYYY/MM/DD"
                                    checked={dateFormat === 'YYYY/MM/DD'}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                />
                                <div className="radio-label">
                                    <span className="format-name">سنة/شهر/يوم</span>
                                    <span className="format-example">2024/01/15</span>
                                </div>
                            </label>
                            
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="dateFormat" 
                                    value="YYYY/MM-DD"
                                    checked={dateFormat === 'YYYY/MM-DD'}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                />
                                <div className="radio-label">
                                    <span className="format-name">سنة/شهر-يوم</span>
                                    <span className="format-example">2024/01-15</span>
                                </div>
                            </label>
                            
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="dateFormat" 
                                    value="YYYY-MM-DD"
                                    checked={dateFormat === 'YYYY-MM-DD'}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                />
                                <div className="radio-label">
                                    <span className="format-name">سنة-شهر-يوم</span>
                                    <span className="format-example">2024-01-15</span>
                                </div>
                            </label>
                            
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="dateFormat" 
                                    value="DD-MM-YYYY"
                                    checked={dateFormat === 'DD-MM-YYYY'}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                />
                                <div className="radio-label">
                                    <span className="format-name">يوم-شهر-سنة (أرقام عربية)</span>
                                    <span className="format-example">١٥-٠١-٢٠٢٤</span>
                                </div>
                            </label>
                            
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="dateFormat" 
                                    value="YYYY"
                                    checked={dateFormat === 'YYYY'}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                />
                                <div className="radio-label">
                                    <span className="format-name">السنة فقط</span>
                                    <span className="format-example">2024</span>
                                </div>
                            </label>
                            
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="dateFormat" 
                                    value="YYYY/MM"
                                    checked={dateFormat === 'YYYY/MM'}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                />
                                <div className="radio-label">
                                    <span className="format-name">سنة/شهر</span>
                                    <span className="format-example">2024/01</span>
                                </div>
                            </label>
                            
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="dateFormat" 
                                    value="CUSTOM"
                                    checked={dateFormat === 'CUSTOM'}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                />
                                <div className="radio-label">
                                    <span className="format-name">نمط مخصص</span>
                                    <span className="format-example">صمم نمط خاص بك</span>
                                </div>
                            </label>
                        </div>
                        
                        {dateFormat === 'CUSTOM' && (
                            <div className="custom-pattern-section">
                                <label className="setting-label">النمط المخصص:</label>
                                <input 
                                    type="text" 
                                    className="custom-pattern-input"
                                    value={customPattern}
                                    onChange={(e) => setCustomPattern(e.target.value)}
                                    placeholder="مثال: YYYY/MMMM/DD"
                                    dir="ltr"
                                />
                                
                                <div className="keywords-reference">
                                    <div className="keywords-header">
                                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
                                        </svg>
                                        الكلمات المفتاحية
                                    </div>
                                    
                                    <div className="keywords-grid">
                                        <div className="keyword-item">
                                            <code>YYYY</code>
                                            <span>سنة كاملة (2024)</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>YY</code>
                                            <span>سنة مختصرة (24)</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>MMMM</code>
                                            <span>اسم الشهر (يناير)</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>MMM</code>
                                            <span>اسم مختصر (ينا)</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>MM</code>
                                            <span>شهر برقمين (01)</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>M</code>
                                            <span>شهر برقم (1)</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>DD</code>
                                            <span>يوم برقمين (05)</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>D</code>
                                            <span>يوم برقم (5)</span>
                                        </div>
                                    </div>
                                    
                                    <div className="keywords-examples">
                                        <strong>أمثلة:</strong>
                                        <div className="example-item">
                                            <code>YYYY/MMMM/DD</code>
                                            <span>→ 2024/يناير/15</span>
                                        </div>
                                        <div className="example-item">
                                            <code>[AR]YYYY-MM-DD</code>
                                            <span>→ ٢٠٢٤-٠١-١٥</span>
                                        </div>
                                        <div className="example-item">
                                            <code>YYYY/MM</code>
                                            <span>→ 2024/01</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="setting-group">
                        <label className="setting-label">
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
                            </svg>
                            معاينة المسار
                        </label>
                        <div className="path-preview">
                            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span id="pathPreviewText">{pathPreview}</span>
                        </div>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        إلغاء
                    </button>
                    <button className="btn-primary" onClick={handleSave}>
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.333 13a2 2 0 0 0 -2 2v2h-4v-2a2 2 0 1 0 -4 0v2h-1.167a1.667 1.667 0 0 1 -1.662 -1.515l-.005 -.152v-12.666c0 -.92 .746 -1.667 1.667 -1.667h.167v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2 -2v-3h.167c.92 0 1.667 .746 1.667 1.667v12.666a1.667 1.667 0 0 1 -1.515 1.662l-.152 .005h-1.167v-2z" />
                        </svg>
                        حفظ الإعدادات
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
