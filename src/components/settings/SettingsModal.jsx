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
            <div className="modal-content modal-small" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="btn-close" onClick={onClose}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
                        </svg>
                    </button>
                    <h2>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: '-0.2em' }}>
                            <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
                        </svg>
                        إعدادات التطبيق
                    </h2>
                </div>
                
                <div className="modal-body">
                    <form id="settingsForm">
                        <div className="form-group">
                            <label>مسار حفظ المستندات</label>
                            <div className="path-input-wrapper">
                                <input 
                                    type="text" 
                                    id="savePathInput"
                                    value={savePath}
                                    readOnly
                                    placeholder="اختر مجلد الحفظ..."
                                />
                                <button type="button" className="btn-browse" onClick={browseSavePath}>
                                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                                    </svg>
                                    استعراض
                                </button>
                            </div>
                            <small>المجلد الذي سيتم حفظ النسخ الجديدة فيه</small>
                        </div>
                        
                        <div className="form-group">
                            <label>نمط تنظيم المجلدات حسب التاريخ</label>
                            <div className="date-format-options">
                                <label className="radio-option" htmlFor="dateFormatYMD">
                                    <input 
                                        type="radio" 
                                        id="dateFormatYMD"
                                        name="dateFormat" 
                                        value="YYYY/MM/DD"
                                        checked={dateFormat === 'YYYY/MM/DD'}
                                        onChange={(e) => setDateFormat(e.target.value)}
                                    />
                                    <span className="radio-label">
                                        <span className="format-name">سنة/شهر/يوم</span>
                                        <span className="format-example">مثال: 2026/10/11</span>
                                    </span>
                                </label>
                                
                                <label className="radio-option" htmlFor="dateFormatYMD2">
                                    <input 
                                        type="radio" 
                                        id="dateFormatYMD2"
                                        name="dateFormat" 
                                        value="YYYY/MM-DD"
                                        checked={dateFormat === 'YYYY/MM-DD'}
                                        onChange={(e) => setDateFormat(e.target.value)}
                                    />
                                    <span className="radio-label">
                                        <span className="format-name">سنة/شهر-يوم</span>
                                        <span className="format-example">مثال: 2026/10-11</span>
                                    </span>
                                </label>
                                
                                <label className="radio-option" htmlFor="dateFormatYMD3">
                                    <input 
                                        type="radio" 
                                        id="dateFormatYMD3"
                                        name="dateFormat" 
                                        value="YYYY-MM-DD"
                                        checked={dateFormat === 'YYYY-MM-DD'}
                                        onChange={(e) => setDateFormat(e.target.value)}
                                    />
                                    <span className="radio-label">
                                        <span className="format-name">سنة-شهر-يوم</span>
                                        <span className="format-example">مثال: 2026-10-11</span>
                                    </span>
                                </label>
                                
                                <label className="radio-option" htmlFor="dateFormatDMY">
                                    <input 
                                        type="radio" 
                                        id="dateFormatDMY"
                                        name="dateFormat" 
                                        value="DD-MM-YYYY"
                                        checked={dateFormat === 'DD-MM-YYYY'}
                                        onChange={(e) => setDateFormat(e.target.value)}
                                    />
                                    <span className="radio-label">
                                        <span className="format-name">يوم-شهر-سنة (أرقام عربية)</span>
                                        <span className="format-example">مثال: ١١-١٠-٢٠٢٦</span>
                                    </span>
                                </label>
                                
                                <label className="radio-option" htmlFor="dateFormatY">
                                    <input 
                                        type="radio" 
                                        id="dateFormatY"
                                        name="dateFormat" 
                                        value="YYYY"
                                        checked={dateFormat === 'YYYY'}
                                        onChange={(e) => setDateFormat(e.target.value)}
                                    />
                                    <span className="radio-label">
                                        <span className="format-name">السنة فقط</span>
                                        <span className="format-example">مثال: 2026</span>
                                    </span>
                                </label>
                                
                                <label className="radio-option" htmlFor="dateFormatYM">
                                    <input 
                                        type="radio" 
                                        id="dateFormatYM"
                                        name="dateFormat" 
                                        value="YYYY/MM"
                                        checked={dateFormat === 'YYYY/MM'}
                                        onChange={(e) => setDateFormat(e.target.value)}
                                    />
                                    <span className="radio-label">
                                        <span className="format-name">سنة/شهر</span>
                                        <span className="format-example">مثال: 2026/10</span>
                                    </span>
                                </label>
                                
                                <label className="radio-option" htmlFor="dateFormatCustom">
                                    <input 
                                        type="radio" 
                                        id="dateFormatCustom"
                                        name="dateFormat" 
                                        value="CUSTOM"
                                        checked={dateFormat === 'CUSTOM'}
                                        onChange={(e) => setDateFormat(e.target.value)}
                                    />
                                    <span className="radio-label">
                                        <span className="format-name">نمط مخصص ✨</span>
                                        <span className="format-example">استخدم الكلمات المفتاحية لإنشاء نمطك الخاص</span>
                                    </span>
                                </label>
                            </div>
                        
                        {/* Custom Pattern Input (shown only when CUSTOM is selected) */}
                        {dateFormat === 'CUSTOM' && (
                            <div id="customPatternSection" className="custom-pattern-section">
                                <div className="form-group">
                                    <label>النمط المخصص</label>
                                    <input 
                                        type="text" 
                                        id="customPatternInput"
                                        className="custom-pattern-input"
                                        value={customPattern}
                                        onChange={(e) => setCustomPattern(e.target.value)}
                                        placeholder="مثال: YYYY/MM/DD أو DD أو MM-MMMM/YYYY"
                                    />
                                    <small>استخدم الكلمات المفتاحية أدناه لإنشاء نمطك الخاص</small>
                                </div>
                                
                                <div className="keywords-reference">
                                    <div className="keywords-header">
                                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1.996l3.221 3.221a1 1 0 0 1 .083 1.32l-.083 .094l-3.221 3.221v5.648a1 1 0 0 1 -1.993 .117l-.007 -.117v-5.648l-3.221 -3.221a1 1 0 0 1 -.083 -1.32l.083 -.094l3.221 -3.221v-1.996a1 1 0 0 1 1 -1z" />
                                        </svg>
                                        الكلمات المفتاحية المتاحة
                                    </div>
                                    <div className="keywords-grid">
                                        <div className="keyword-item">
                                            <code>YYYY</code>
                                            <span>السنة (4 أرقام): 2026</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>YY</code>
                                            <span>السنة (رقمان): 26</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>MM</code>
                                            <span>الشهر (رقمان): 01-12</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>M</code>
                                            <span>الشهر (رقم بدون صفر): 1-12</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>MMMM</code>
                                            <span>اسم الشهر كامل: أكتوبر</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>MMM</code>
                                            <span>اسم الشهر مختصر: أكت</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>DD</code>
                                            <span>اليوم (رقمان): 01-31</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>D</code>
                                            <span>اليوم (رقم بدون صفر): 1-31</span>
                                        </div>
                                        <div className="keyword-item">
                                            <code>[AR]</code>
                                            <span>تحويل للأرقام العربية: ١١-١٠-٢٠٢٦</span>
                                        </div>
                                    </div>
                                    <div className="keywords-examples">
                                        <strong>أمثلة:</strong>
                                        <div className="example-item"><code>DD</code> → <span>11</span></div>
                                        <div className="example-item"><code>MM-MMMM/YYYY</code> → <span>10-أكتوبر/2026</span></div>
                                        <div className="example-item"><code>[AR]DD-MM-YYYY</code> → <span>١١-١٠-٢٠٢٦</span></div>
                                        <div className="example-item"><code>YYYY/MMMM/DD</code> → <span>2026/أكتوبر/11</span></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="form-group">
                        <label>معاينة المسار الناتج</label>
                        <div className="path-preview" id="pathPreview">
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span id="pathPreviewText">{pathPreview}</span>
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>إلغاء</button>
                        <button type="button" className="btn-success" onClick={handleSave}>
                            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 3a1 1 0 0 1 .707 .293l4 4a1 1 0 0 1 .293 .707v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h1v4a1 1 0 0 0 .883 .993l.117 .007h6a1 1 0 0 0 1 -1v-4zm-4 8a2.995 2.995 0 0 0 -2.995 2.898a1 1 0 0 0 -.005 .102a3 3 0 1 0 3 -3m1 -8v3h-4v-3z" />
                            </svg>
                            حفظ الإعدادات
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
};

export default SettingsModal;
