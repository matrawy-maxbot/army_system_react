import { useState, useEffect, useCallback } from 'react';

/**
 * Hook لإدارة قائمة الملفات اليومية
 * @param {Date} selectedDate - التاريخ المحدد لتحميل الملفات
 * @returns {Object} - { files, loading, error, refresh }
 */
export const useTodayFiles = (selectedDate = new Date()) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // دالة لتحميل الملفات من المجلد
    const loadFiles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // تنسيق التاريخ بصيغة DD-MM-YYYY
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            const dateString = `${day}-${month}-${year}`;

            console.log('📂 Loading files for date:', dateString);

            // طلب الملفات من Electron
            const result = await window.electronAPI.getTodayFiles(dateString);

            if (result.success) {
                console.log('✅ Files loaded:', result.files.length);
                setFiles(result.files || []);
            } else {
                console.error('❌ Failed to load files:', result.error);
                setError(result.error || 'فشل تحميل الملفات');
                setFiles([]);
            }
        } catch (err) {
            console.error('❌ Error loading files:', err);
            setError('حدث خطأ أثناء تحميل الملفات');
            setFiles([]);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    // تحميل الملفات عند تغيير التاريخ
    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    // دالة لتحديث القائمة يدوياً
    const refresh = useCallback(() => {
        loadFiles();
    }, [loadFiles]);

    return {
        files,
        loading,
        error,
        refresh
    };
};
