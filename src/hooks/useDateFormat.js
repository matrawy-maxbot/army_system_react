import React, { useCallback, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';

/**
 * Hook لتنسيق التواريخ حسب الإعدادات
 * @returns {Object} - { formatDate, formatDateByPattern, dateFormat, customPattern }
 */
export const useDateFormat = () => {
    const { settings } = useSettings();
    const dateFormat = settings?.dateFormat || 'DD-MM-YYYY';
    const customPattern = settings?.customPattern || '';

    // الأرقام العربية الهندية
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

    // أسماء الأشهر بالعربية
    const monthNamesArabic = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const monthNamesArabicShort = [
        'ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون',
        'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'
    ];

    // تحويل رقم إلى أرقام عربية
    const toArabicNumerals = useCallback((str) => {
        return str.split('').map(char => {
            if (char >= '0' && char <= '9') {
                return arabicNumerals[parseInt(char)];
            }
            return char;
        }).join('');
    }, [arabicNumerals]);

    // معالجة النمط المخصص
    const processCustomPattern = useCallback((date, template) => {
        const day = String(date.getDate()).padStart(2, '0');
        const dayNoZero = String(date.getDate());
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const monthNoZero = String(date.getMonth() + 1);
        const year = date.getFullYear();
        const yearShort = String(year).slice(-2);

        let result = template;
        let convertToArabic = false;

        // فحص إذا كان هناك [AR] في البداية
        if (result.startsWith('[AR]')) {
            convertToArabic = true;
            result = result.substring(4); // إزالة [AR]
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
    }, [monthNamesArabic, monthNamesArabicShort, toArabicNumerals]);

    // تنسيق التاريخ حسب النمط المحدد
    const formatDateByPattern = useCallback((date, pattern, custom = '') => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        if (isNaN(date.getTime())) {
            return 'تاريخ غير صحيح';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        // معالجة النمط المخصص
        if (pattern === 'CUSTOM' && custom) {
            return processCustomPattern(date, custom);
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
    }, [processCustomPattern, toArabicNumerals]);

    // تنسيق التاريخ باستخدام الإعدادات الحالية
    const formatDate = useCallback((date) => {
        return formatDateByPattern(date, dateFormat, customPattern);
    }, [formatDateByPattern, dateFormat, customPattern]);

    // تنسيق التاريخ بالأرقام العربية فقط (dd-mm-yyyy)
    const formatDateArabic = useCallback((date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        if (isNaN(date.getTime())) {
            return 'تاريخ غير صحيح';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return toArabicNumerals(`${day}-${month}-${year}`);
    }, [toArabicNumerals]);

    // تنسيق التاريخ مع الوقت
    const formatDateTime = useCallback((date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        if (isNaN(date.getTime())) {
            return 'تاريخ غير صحيح';
        }

        const dateStr = formatDate(date);
        const timeStr = date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `${dateStr} - ${timeStr}`;
    }, [formatDate]);

    // تنسيق التاريخ بشكل مطول (مع اسم اليوم والشهر)
    const formatDateLong = useCallback((date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        if (isNaN(date.getTime())) {
            return 'تاريخ غير صحيح';
        }

        return date.toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, []);

    // تنسيق الوقت فقط
    const formatTime = useCallback((date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        if (isNaN(date.getTime())) {
            return 'وقت غير صحيح';
        }

        return date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    // الحصول على التاريخ بصيغة YYYY-MM-DD للـ input date
    const toInputDateFormat = useCallback((date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        if (isNaN(date.getTime())) {
            return '';
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }, []);

    // تحويل من صيغة YYYY-MM-DD إلى Date
    const fromInputDateFormat = useCallback((dateString) => {
        if (!dateString) return null;

        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }, []);

    return {
        formatDate,
        formatDateByPattern,
        formatDateArabic,
        formatDateTime,
        formatDateLong,
        formatTime,
        toInputDateFormat,
        fromInputDateFormat,
        toArabicNumerals,
        dateFormat,
        customPattern
    };
};

/**
 * Hook للحصول على التاريخ والوقت الحالي بصيغة منسقة
 * @param {boolean} includeTime - تضمين الوقت (افتراضي: true)
 * @param {number} updateInterval - فترة التحديث بالمللي ثانية (افتراضي: 1000)
 * @returns {string} - التاريخ والوقت المنسق
 */
export const useCurrentDateTime = (includeTime = true, updateInterval = 1000) => {
    const { formatDate, formatTime } = useDateFormat();
    const [currentDateTime, setCurrentDateTime] = React.useState('');

    React.useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            if (includeTime) {
                const dateStr = formatDate(now);
                const timeStr = formatTime(now);
                setCurrentDateTime(`${dateStr} - ${timeStr}`);
            } else {
                setCurrentDateTime(formatDate(now));
            }
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, updateInterval);

        return () => clearInterval(interval);
    }, [formatDate, formatTime, includeTime, updateInterval]);

    return currentDateTime;
};
