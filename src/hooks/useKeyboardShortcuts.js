import { useEffect, useCallback } from 'react';

/**
 * Hook لإضافة اختصارات لوحة المفاتيح
 * @param {Object} shortcuts - كائن يحتوي على الاختصارات والدوال المرتبطة بها
 * @param {boolean} enabled - تفعيل أو تعطيل الاختصارات (افتراضي: true)
 * 
 * @example
 * useKeyboardShortcuts({
 *   'ctrl+s': handleSave,
 *   'ctrl+n': handleNew,
 *   'escape': handleClose
 * });
 */
export const useKeyboardShortcuts = (shortcuts = {}, enabled = true) => {
    const handleKeyDown = useCallback((event) => {
        if (!enabled) return;

        // بناء مفتاح الاختصار
        const keys = [];
        if (event.ctrlKey) keys.push('ctrl');
        if (event.altKey) keys.push('alt');
        if (event.shiftKey) keys.push('shift');
        if (event.metaKey) keys.push('meta');
        
        const key = event.key.toLowerCase();
        keys.push(key);
        
        const shortcut = keys.join('+');

        // البحث عن الاختصار المطابق
        if (shortcuts[shortcut]) {
            event.preventDefault();
            shortcuts[shortcut](event);
        }
    }, [shortcuts, enabled]);

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown, enabled]);
};

/**
 * Hook لاختصار واحد
 * @param {string} shortcut - الاختصار (مثل 'ctrl+s')
 * @param {Function} callback - الدالة المراد تنفيذها
 * @param {boolean} enabled - تفعيل أو تعطيل (افتراضي: true)
 */
export const useKeyboardShortcut = (shortcut, callback, enabled = true) => {
    useKeyboardShortcuts({ [shortcut]: callback }, enabled);
};

/**
 * Hook لاختصار Escape لإغلاق النوافذ
 * @param {Function} onEscape - الدالة المراد تنفيذها عند الضغط على Escape
 * @param {boolean} enabled - تفعيل أو تعطيل (افتراضي: true)
 */
export const useEscapeKey = (onEscape, enabled = true) => {
    useKeyboardShortcut('escape', onEscape, enabled);
};

/**
 * Hook للاختصارات العالمية للتطبيق
 * @param {Object} handlers - كائن يحتوي على معالجات الأحداث
 * @returns {Object} - الاختصارات المسجلة
 */
export const useGlobalShortcuts = (handlers = {}) => {
    const shortcuts = {
        // حفظ
        'ctrl+s': handlers.onSave,
        // جديد
        'ctrl+n': handlers.onNew,
        // بحث
        'ctrl+f': handlers.onSearch,
        // طباعة
        'ctrl+p': handlers.onPrint,
        // تحديث
        'f5': handlers.onRefresh,
        // إعدادات
        'ctrl+,': handlers.onSettings,
        // إغلاق
        'ctrl+w': handlers.onClose,
        // تحديد الكل
        'ctrl+a': handlers.onSelectAll,
        // نسخ
        'ctrl+c': handlers.onCopy,
        // لصق
        'ctrl+v': handlers.onPaste,
        // قص
        'ctrl+x': handlers.onCut,
        // تراجع
        'ctrl+z': handlers.onUndo,
        // إعادة
        'ctrl+y': handlers.onRedo,
    };

    // فلترة الاختصارات غير المعرفة
    const activeShortcuts = Object.entries(shortcuts)
        .filter(([_, handler]) => typeof handler === 'function')
        .reduce((acc, [key, handler]) => {
            acc[key] = handler;
            return acc;
        }, {});

    useKeyboardShortcuts(activeShortcuts);

    return activeShortcuts;
};

/**
 * Hook للاختصارات الخاصة بالنماذج
 * @param {Object} handlers - معالجات الأحداث
 */
export const useFormShortcuts = (handlers = {}) => {
    const shortcuts = {
        // حفظ (Enter في حقول الإدخال)
        'ctrl+enter': handlers.onSubmit,
        // إلغاء (Escape)
        'escape': handlers.onCancel,
    };

    const activeShortcuts = Object.entries(shortcuts)
        .filter(([_, handler]) => typeof handler === 'function')
        .reduce((acc, [key, handler]) => {
            acc[key] = handler;
            return acc;
        }, {});

    useKeyboardShortcuts(activeShortcuts);
};

/**
 * Hook للاختصارات الخاصة بالقوائم
 * @param {Object} handlers - معالجات الأحداث
 */
export const useListShortcuts = (handlers = {}) => {
    const shortcuts = {
        // حذف
        'delete': handlers.onDelete,
        // تحديد الكل
        'ctrl+a': handlers.onSelectAll,
        // إلغاء التحديد
        'escape': handlers.onClearSelection,
    };

    const activeShortcuts = Object.entries(shortcuts)
        .filter(([_, handler]) => typeof handler === 'function')
        .reduce((acc, [key, handler]) => {
            acc[key] = handler;
            return acc;
        }, {});

    useKeyboardShortcuts(activeShortcuts);
};
