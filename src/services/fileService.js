/**
 * fileService.js
 * خدمات التعامل مع الملفات
 * نسخة من المنطق في script.js بدون تغيير
 */

import { electronAPI } from './electronAPI.js';

/**
 * Helper function to get correct asset URL using custom protocol
 * نسخة من دالة getAssetUrl في script.js
 */
export function getAssetUrl(relativePath) {
    if (!relativePath) return null;
    return `asset://${encodeURIComponent(relativePath)}`;
}

/**
 * اختيار ملف باستخدام Electron dialog
 */
export async function selectFile(options = {}) {
    const result = await electronAPI.selectFile(options);
    return result;
}

/**
 * اختيار مجلد باستخدام Electron dialog
 */
export async function selectFolder(title = '') {
    const result = await electronAPI.selectFolder(title);
    return result;
}

/**
 * اختيار ملفات متعددة
 */
export async function selectMultipleFiles(options = {}) {
    const result = await electronAPI.selectMultipleFiles(options);
    return result;
}

/**
 * فتح ملف في التطبيق الافتراضي
 */
export async function openFile(path) {
    const result = await electronAPI.openFile(path);
    return result;
}

/**
 * فتح مجلد في مستكشف الملفات
 */
export async function openFolder(path) {
    const result = await electronAPI.openFolder(path);
    return result;
}

/**
 * نسخ ملف من مصدر إلى وجهة
 */
export async function copyFile(source, destination) {
    const result = await electronAPI.copyFile(source, destination);
    return result;
}

/**
 * حذف ملف
 */
export async function deleteFile(path) {
    const result = await electronAPI.deleteFile(path);
    return result;
}

/**
 * فحص وجود ملف
 */
export async function fileExists(path) {
    const result = await electronAPI.fileExists(path);
    return result;
}

/**
 * الحصول على معلومات الملف
 */
export async function getFileInfo(path) {
    const result = await electronAPI.getFileInfo(path);
    return result;
}

/**
 * الحصول على ملفات اليوم
 * نسخة من renderTodayFiles في script.js
 */
export async function getTodayFiles(dateStr, savePath) {
    try {
        const result = await electronAPI.getTodayFiles(dateStr, savePath);
        
        if (!result.success || !result.files || result.files.length === 0) {
            return { success: true, files: [] };
        }
        
        return { success: true, files: result.files };
    } catch (error) {
        console.error('Error loading today files:', error);
        return { success: false, error: error.message, files: [] };
    }
}

/**
 * فتح مجلد نسخ اليوم
 * نسخة من openTodayCopiesFolder في script.js
 */
export async function openTodayCopiesFolder(dateStr, savePath) {
    const result = await electronAPI.openTodayCopiesFolder(dateStr, savePath);
    return result;
}

/**
 * نسخ ملف إلى assets
 */
export async function copyFileToAssets(sourcePath, categoryId, documentId) {
    const result = await electronAPI.copyFileToAssets(sourcePath, categoryId, documentId);
    return result;
}

/**
 * حذف ملف من assets
 */
export async function deleteFileFromAssets(relativePath) {
    const result = await electronAPI.deleteFileFromAssets(relativePath);
    return result;
}

/**
 * إنشاء نسخة جديدة من مستند
 */
export async function createDocumentCopy(categoryId, documentId, copyNumber) {
    const result = await electronAPI.createDocumentCopy(categoryId, documentId, copyNumber);
    return result;
}

/**
 * حذف نسخة مستند
 */
export async function deleteDocumentCopy(categoryId, documentId, copyNumber) {
    const result = await electronAPI.deleteDocumentCopy(categoryId, documentId, copyNumber);
    return result;
}

/**
 * فتح مجلد نسخ المستند
 */
export async function openDocumentCopiesFolder(categoryId, documentId) {
    const result = await electronAPI.openCopiesFolder(categoryId, documentId);
    return result;
}

/**
 * الحصول على عدد نسخ المستند
 */
export async function getDocumentCopiesCount(categoryId, documentId) {
    const result = await electronAPI.getDocumentCopiesCount(categoryId, documentId);
    return result;
}

export default {
    getAssetUrl,
    selectFile,
    selectFolder,
    selectMultipleFiles,
    openFile,
    openFolder,
    copyFile,
    deleteFile,
    fileExists,
    getFileInfo,
    getTodayFiles,
    openTodayCopiesFolder,
    copyFileToAssets,
    deleteFileFromAssets,
    createDocumentCopy,
    deleteDocumentCopy,
    openDocumentCopiesFolder,
    getDocumentCopiesCount
};
