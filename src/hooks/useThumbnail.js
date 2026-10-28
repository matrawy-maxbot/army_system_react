import { useState, useEffect, useCallback } from 'react';

/**
 * Hook لتوليد وإدارة الصور المصغرة للملفات
 * @param {string} filePath - مسار الملف
 * @param {number} fileModTime - وقت التعديل الأخير للملف (timestamp)
 * @returns {Object} - { thumbnail, loading, error, regenerate }
 */
export const useThumbnail = (filePath, fileModTime = null) => {
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // دالة لتوليد أو تحميل الصورة المصغرة
    const generateThumbnail = useCallback(async () => {
        if (!filePath) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log('🖼️ Generating thumbnail for:', filePath);

            // طلب الصورة المصغرة من Electron
            const result = await window.electronAPI.getThumbnailForFile(filePath, fileModTime);

            if (result.success && result.thumbnailPath) {
                console.log('✅ Thumbnail generated:', result.thumbnailPath);
                // تحويل المسار إلى URL قابل للاستخدام
                const thumbnailUrl = `file://${result.thumbnailPath.replace(/\\/g, '/')}`;
                setThumbnail(thumbnailUrl);
            } else {
                console.warn('⚠️ Failed to generate thumbnail:', result.error);
                setError(result.error || 'فشل توليد الصورة المصغرة');
                setThumbnail(null);
            }
        } catch (err) {
            console.error('❌ Error generating thumbnail:', err);
            setError('حدث خطأ أثناء توليد الصورة المصغرة');
            setThumbnail(null);
        } finally {
            setLoading(false);
        }
    }, [filePath, fileModTime]);

    // توليد الصورة المصغرة عند تغيير المسار أو وقت التعديل
    useEffect(() => {
        generateThumbnail();
    }, [generateThumbnail]);

    // دالة لإعادة توليد الصورة المصغرة يدوياً
    const regenerate = useCallback(() => {
        generateThumbnail();
    }, [generateThumbnail]);

    return {
        thumbnail,
        loading,
        error,
        regenerate
    };
};

/**
 * Hook لتنظيف الصور المصغرة القديمة
 * @returns {Function} - دالة لتنظيف الصور القديمة
 */
export const useThumbnailCleanup = () => {
    const cleanupOldThumbnails = useCallback(async () => {
        try {
            console.log('🧹 Cleaning up old thumbnails...');
            const result = await window.electronAPI.cleanupOldThumbnails();
            
            if (result.success) {
                console.log('✅ Cleaned up thumbnails:', result.deleted);
                return { success: true, deleted: result.deleted };
            } else {
                console.error('❌ Failed to cleanup thumbnails:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('❌ Error cleaning up thumbnails:', error);
            return { success: false, error: error.message };
        }
    }, []);

    return cleanupOldThumbnails;
};

/**
 * Hook للتحقق من وجود صورة مصغرة
 * @param {string} filePath - مسار الملف
 * @returns {Object} - { exists, check }
 */
export const useThumbnailExists = (filePath) => {
    const [exists, setExists] = useState(false);

    const check = useCallback(async () => {
        if (!filePath) {
            setExists(false);
            return;
        }

        try {
            const result = await window.electronAPI.thumbnailExists(filePath);
            setExists(result.exists || false);
        } catch (error) {
            console.error('❌ Error checking thumbnail:', error);
            setExists(false);
        }
    }, [filePath]);

    useEffect(() => {
        check();
    }, [check]);

    return { exists, check };
};
