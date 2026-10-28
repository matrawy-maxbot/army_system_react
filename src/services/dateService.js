/**
 * dateService.js
 * خدمات تنسيق التاريخ (جميع الأنماط السبعة + المخصص)
 * نسخة من المنطق في script.js بدون تغيير
 */

/**
 * تنسيق التاريخ بالأرقام العربية
 * نسخة من formatDateArabic في script.js
 */
export function formatDateArabic(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // استخدام الأرقام العربية الهندية
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return `${day}-${month}-${year}`.split('').map(char => {
        if (char >= '0' && char <= '9') {
            return arabicNumerals[parseInt(char)];
        }
        return char;
    }).join('');
}

/**
 * دالة محدثة لتنسيق التاريخ حسب النمط المختار
 * نسخة من formatDateByPattern في script.js
 */
export function formatDateByPattern(date, pattern, customPattern = '') {
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
}

/**
 * تحديث التاريخ والوقت بالتنسيق العربي
 * نسخة من updateDateTime في script.js
 */
export function getCurrentDateTimeString() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    // استخدام التقويم الميلادي بدلاً من الهجري
    const dateStr = now.toLocaleDateString('ar-EG', options);
    const timeStr = now.toLocaleTimeString('ar-EG', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    return `${dateStr} - ${timeStr}`;
}

/**
 * تحويل تاريخ إلى صيغة YYYY-MM-DD المحلية
 */
export function toLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * تحويل من صيغة YYYY-MM-DD إلى Date محلي
 */
export function fromLocalDateString(dateString) {
    const [y, m, d] = dateString.split('-').map(Number);
    return new Date(y, m - 1, d); // الشهر يبدأ من 0
}

/**
 * فحص إذا كان التاريخ هو اليوم
 */
export function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

/**
 * الحصول على تاريخ اليوم
 */
export function getToday() {
    return new Date();
}

/**
 * الحصول على تاريخ اليوم بصيغة YYYY-MM-DD
 */
export function getTodayString() {
    return toLocalDateString(getToday());
}

export default {
    formatDateArabic,
    formatDateByPattern,
    getCurrentDateTimeString,
    toLocalDateString,
    fromLocalDateString,
    isToday,
    getToday,
    getTodayString
};
