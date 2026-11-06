import React, { useState } from 'react';
import './date-format-modal.css';

const DateFormatModal = ({ isOpen, onClose, currentFormat, currentCustomPattern, onSave }) => {
    const [dateFormat, setDateFormat] = useState(currentFormat);
    const [customPattern, setCustomPattern] = useState(currentCustomPattern);
    const [preview, setPreview] = useState('');

    // تحديث المعاينة عند تغيير النمط
    React.useEffect(() => {
        updatePreview();
    }, [dateFormat, customPattern]);

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

    const updatePreview = () => {
        if (dateFormat === 'CUSTOM' && !customPattern.trim()) {
            setPreview('');
            return;
        }
        
        const result = formatDateByPattern(new Date(), dateFormat, customPattern);
        setPreview(result);
    };

    const handleSave = () => {
        if (dateFormat === 'CUSTOM' && !customPattern.trim()) {
            alert('الرجاء إدخال نمط مخصص');
            return;
        }
        
        onSave(dateFormat, customPattern);
        onClose();
    };

    const handleCancel = () => {
        // إعادة القيم الأصلية
        setDateFormat(currentFormat);
        setCustomPattern(currentCustomPattern);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal active" onClick={handleCancel}>
            <div className="modal-content date-format-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="btn-close" onClick={handleCancel}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
                        </svg>
                    </button>
                    <h2>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: '-0.2em' }}>
                            <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" />
                            <path d="M16 3v4" />
                            <path d="M8 3v4" />
                            <path d="M4 11h16" />
                            <path d="M11 15h1" />
                            <path d="M12 15v3" />
                        </svg>
                        اختر نمط تنظيم المجلدات
                    </h2>
                </div>

                <div className="modal-body">
                    {/* معاينة النمط الحالي */}
                    {preview && (
                        <div className="format-preview-box">
                            <div className="format-preview-label">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0 -20m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0 -16m0 3a1 1 0 0 1 .993 .883l.007 .117v4.764l2.293 2.293a1 1 0 0 1 .083 1.32l-.083 .094a1 1 0 0 1 -1.32 .083l-.094 -.083l-2.707 -2.708a1 1 0 0 1 -.284 -.576l-.01 -.131v-5a1 1 0 0 1 1 -1" />
                                </svg>
                                معاينة النمط:
                            </div>
                            <div className="format-preview-value">{preview}</div>
                        </div>
                    )}

                    {/* الأنماط المحددة مسبقًا */}
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
                
                    {/* قسم النمط المخصص */}
                    {dateFormat === 'CUSTOM' && (
                        <div className="custom-pattern-section">
                            <div className="form-group">
                                <label>النمط المخصص</label>
                                <input 
                                    type="text" 
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

                    {/* أزرار الإجراءات */}
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCancel}>
                            إلغاء
                        </button>
                        <button type="button" className="btn-primary" onClick={handleSave}>
                            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                            </svg>
                            تطبيق النمط
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateFormatModal;
