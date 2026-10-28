/**
 * thumbnailService.js
 * خدمات الصور المصغرة
 * نسخة من المنطق في script.js بدون تغيير
 */

import { electronAPI } from './electronAPI.js';

// Cache للصور المصغرة لمنع التكرار
// نسخة من المتغيرات في script.js
const thumbnailCache = new Map();
const thumbnailGenerationInProgress = new Set();

/**
 * توليد صورة مصغرة لملف
 */
export async function generateThumbnail(filePath) {
    const result = await electronAPI.generateThumbnail(filePath);
    return result;
}

/**
 * الحصول على مسار الصورة المصغرة
 */
export async function getThumbnailPath(filePath) {
    const result = await electronAPI.getThumbnailPath(filePath);
    return result;
}

/**
 * فحص وجود صورة مصغرة
 */
export async function thumbnailExists(filePath) {
    const result = await electronAPI.thumbnailExists(filePath);
    return result;
}

/**
 * تنظيف الصور المصغرة القديمة
 */
export async function cleanupOldThumbnails() {
    const result = await electronAPI.cleanupOldThumbnails();
    return result;
}

/**
 * الحصول على صورة مصغرة مع التخزين المؤقت
 */
export async function getThumbnailForFile(filePath, fileModTime) {
    const result = await electronAPI.getThumbnailForFile(filePath, fileModTime);
    return result;
}

/**
 * دالة مساعدة لتوليد الـ thumbnail بشكل غير متزامن مع cache
 * نسخة من generateThumbnailAsync في script.js
 */
export async function generateThumbnailAsync(filePath, onSuccess, onError) {
    // التحقق من الـ cache أولاً
    if (thumbnailCache.has(filePath)) {
        const cachedPath = thumbnailCache.get(filePath);
        console.log('📦 Using cached thumbnail for:', filePath);
        if (onSuccess) {
            onSuccess(cachedPath);
        }
        return { success: true, thumbnailPath: cachedPath, cached: true };
    }
    
    // التحقق من أن التوليد ليس قيد التنفيذ
    if (thumbnailGenerationInProgress.has(filePath)) {
        console.log('⏳ Thumbnail generation already in progress for:', filePath);
        return { success: false, error: 'Generation in progress' };
    }
    
    // وضع علامة أن التوليد قيد التنفيذ
    thumbnailGenerationInProgress.add(filePath);
    
    try {
        const result = await electronAPI.generateThumbnail(filePath);
        
        if (result.success && result.thumbnailPath) {
            // حفظ في الـ cache
            thumbnailCache.set(filePath, result.thumbnailPath);
            
            // استدعاء callback النجاح
            if (onSuccess) {
                onSuccess(result.thumbnailPath);
            }
            
            return { success: true, thumbnailPath: result.thumbnailPath, cached: false };
        } else {
            // فشل توليد الـ thumbnail
            if (onError) {
                onError(result.error || 'Failed to generate thumbnail');
            }
            return { success: false, error: result.error || 'Failed to generate thumbnail' };
        }
    } catch (error) {
        console.error('❌ Error generating thumbnail:', error);
        if (onError) {
            onError(error.message);
        }
        return { success: false, error: error.message };
    } finally {
        // إزالة علامة التنفيذ
        thumbnailGenerationInProgress.delete(filePath);
    }
}

/**
 * مسح الـ cache
 */
export function clearThumbnailCache() {
    thumbnailCache.clear();
    console.log('🗑️ Thumbnail cache cleared');
}

/**
 * مسح thumbnail محدد من الـ cache
 */
export function removeThumbnailFromCache(filePath) {
    const removed = thumbnailCache.delete(filePath);
    if (removed) {
        console.log('🗑️ Removed thumbnail from cache:', filePath);
    }
    return removed;
}

/**
 * الحصول على حجم الـ cache
 */
export function getThumbnailCacheSize() {
    return thumbnailCache.size;
}

/**
 * الحصول على جميع المفاتيح في الـ cache
 */
export function getThumbnailCacheKeys() {
    return Array.from(thumbnailCache.keys());
}

/**
 * فحص إذا كان thumbnail في الـ cache
 */
export function isThumbnailCached(filePath) {
    return thumbnailCache.has(filePath);
}

/**
 * فحص إذا كان التوليد قيد التنفيذ
 */
export function isThumbnailGenerating(filePath) {
    return thumbnailGenerationInProgress.has(filePath);
}

export default {
    generateThumbnail,
    getThumbnailPath,
    thumbnailExists,
    cleanupOldThumbnails,
    getThumbnailForFile,
    generateThumbnailAsync,
    clearThumbnailCache,
    removeThumbnailFromCache,
    getThumbnailCacheSize,
    getThumbnailCacheKeys,
    isThumbnailCached,
    isThumbnailGenerating
};
