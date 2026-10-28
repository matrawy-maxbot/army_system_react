import React, { createContext, useState, useEffect, useContext } from 'react';

// إنشاء Context
const SettingsContext = createContext(null);

// Provider Component
export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        savePath: '',
        dateFormat: 'DD-MM-YYYY',
        customPattern: ''
    });

    const [isLoading, setIsLoading] = useState(true);

    // تحميل الإعدادات عند بدء التطبيق
    useEffect(() => {
        loadSettings();
    }, []);

    // تحميل الإعدادات
    const loadSettings = async () => {
        try {
            setIsLoading(true);
            const result = await window.electronAPI.loadSettings();
            
            if (result.success && result.settings) {
                setSettings(result.settings);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // حفظ الإعدادات
    const saveSettings = async (newSettings = null) => {
        try {
            const settingsToSave = newSettings || settings;
            const result = await window.electronAPI.saveSettings(settingsToSave);
            
            if (result.success) {
                if (newSettings) {
                    setSettings(newSettings);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    };

    // تحديث الإعدادات
    const updateSettings = async (updates) => {
        const newSettings = { ...settings, ...updates };
        const success = await saveSettings(newSettings);
        if (success) {
            setSettings(newSettings);
        }
        return success;
    };

    // تحديد مسار الحفظ
    const selectSavePath = async () => {
        try {
            const result = await window.electronAPI.selectFolder('اختر مجلد الحفظ');
            if (result.success && result.path) {
                await updateSettings({ savePath: result.path });
                return result.path;
            }
            return null;
        } catch (error) {
            console.error('Error selecting save path:', error);
            return null;
        }
    };

    // الحصول على مسار الحفظ الكامل لتاريخ معين
    const getSavePathForDate = (date = new Date()) => {
        if (!settings.savePath) return '';
        
        const formattedDate = formatDateByPattern(date, settings.dateFormat, settings.customPattern);
        return `${settings.savePath}\\${formattedDate}`;
    };

    // تنسيق التاريخ حسب النمط المحدد
    const formatDateByPattern = (date, pattern, customPattern = '') => {
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
        
        // دالة لتحويل رقم إلى أرقام عربية
        const toArabicNumerals = (str) => {
            return str.split('').map(char => {
                if (char >= '0' && char <= '9') {
                    return arabicNumerals[parseInt(char)];
                }
                return char;
            }).join('');
        };
        
        // دالة لمعالجة النمط المخصص
        const processCustomPattern = (template) => {
            let result = template;
            let convertToArabic = false;
            
            // فحص إذا كان هناك [AR] في البداية
            if (result.startsWith('[AR]')) {
                convertToArabic = true;
                result = result.substring(4);
            }
            
            // استبدال الكلمات المفتاحية
            result = result.replace(/YYYY/g, year);
            result = result.replace(/YY/g, yearShort);
            result = result.replace(/MMMM/g, monthNamesArabic[date.getMonth()]);
            result = result.replace(/MMM/g, monthNamesArabicShort[date.getMonth()]);
            result = result.replace(/MM/g, month);
            result = result.replace(/M/g, monthNoZero);
            result = result.replace(/DD/g, day);
            result = result.replace(/D/g, dayNoZero);
            
            // تحويل للأرقام العربية إذا كان مطلوباً
            if (convertToArabic) {
                result = toArabicNumerals(result);
            }
            
            return result;
        };
        
        // معالجة النمط المخصص
        if (pattern === 'CUSTOM' && customPattern) {
            return processCustomPattern(customPattern);
        }
        
        // الأنماط المحددة مسبقاً
        switch (pattern) {
            case 'YYYY/MM/DD':
                return `${year}/${month}/${day}`;
            
            case 'YYYY/MM-DD':
                return `${year}/${month}-${day}`;
            
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            
            case 'DD-MM-YYYY':
                // نمط خاص: أرقام عربية
                return toArabicNumerals(`${day}-${month}-${year}`);
            
            case 'YYYY':
                return `${year}`;
            
            case 'YYYY/MM':
                return `${year}/${month}`;
            
            default:
                // افتراضي: DD-MM-YYYY بأرقام عربية
                return toArabicNumerals(`${day}-${month}-${year}`);
        }
    };

    const value = {
        settings,
        isLoading,
        loadSettings,
        saveSettings,
        updateSettings,
        selectSavePath,
        getSavePathForDate,
        formatDateByPattern
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

// Custom Hook لاستخدام Context
export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
}

export default SettingsContext;
