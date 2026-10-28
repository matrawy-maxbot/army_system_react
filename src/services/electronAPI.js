/**
 * electronAPI.js
 * Wrapper لجميع استدعاءات IPC مع Electron
 * نسخة من المنطق في script.js بدون تغيير
 */

// Wrapper لجميع استدعاءات window.electronAPI
export const electronAPI = {
    // ========== File Operations ==========
    
    /**
     * اختيار ملف واحد
     */
    selectFile: async (options) => {
        return await window.electronAPI.selectFile(options);
    },
    
    /**
     * اختيار مجلد
     */
    selectFolder: async (title) => {
        return await window.electronAPI.selectFolder(title);
    },
    
    /**
     * اختيار ملفات متعددة
     */
    selectMultipleFiles: async (options) => {
        return await window.electronAPI.selectMultipleFiles(options);
    },
    
    /**
     * فتح ملف
     */
    openFile: async (path) => {
        return await window.electronAPI.openFile(path);
    },
    
    /**
     * فتح مجلد
     */
    openFolder: async (path) => {
        return await window.electronAPI.openFolder(path);
    },
    
    /**
     * نسخ ملف
     */
    copyFile: async (source, destination) => {
        return await window.electronAPI.copyFile(source, destination);
    },
    
    /**
     * حذف ملف
     */
    deleteFile: async (path) => {
        return await window.electronAPI.deleteFile(path);
    },
    
    /**
     * فحص وجود ملف
     */
    fileExists: async (path) => {
        return await window.electronAPI.fileExists(path);
    },
    
    /**
     * معلومات الملف
     */
    getFileInfo: async (path) => {
        return await window.electronAPI.getFileInfo(path);
    },
    
    // ========== Data Operations ==========
    
    /**
     * تحميل البيانات من storage
     */
    loadData: async () => {
        return await window.electronAPI.loadData();
    },
    
    /**
     * حفظ البيانات إلى storage
     */
    saveData: async (data) => {
        return await window.electronAPI.saveData(data);
    },
    
    /**
     * تحميل الإعدادات
     */
    loadSettings: async () => {
        return await window.electronAPI.loadSettings();
    },
    
    /**
     * حفظ الإعدادات
     */
    saveSettings: async (settings) => {
        return await window.electronAPI.saveSettings(settings);
    },
    
    // ========== Today Files Operations ==========
    
    /**
     * الحصول على ملفات اليوم
     */
    getTodayFiles: async (dateStr, savePath) => {
        return await window.electronAPI.getTodayFiles(dateStr, savePath);
    },
    
    /**
     * فتح مجلد نسخ اليوم
     */
    openTodayCopiesFolder: async (dateStr, savePath) => {
        return await window.electronAPI.openTodayCopiesFolder(dateStr, savePath);
    },
    
    // ========== Document Operations ==========
    
    /**
     * نسخ ملف إلى assets
     */
    copyFileToAssets: async (sourcePath, categoryId, documentId) => {
        return await window.electronAPI.copyFileToAssets(sourcePath, categoryId, documentId);
    },
    
    /**
     * حذف ملف من assets
     */
    deleteFileFromAssets: async (relativePath) => {
        return await window.electronAPI.deleteFileFromAssets(relativePath);
    },
    
    /**
     * إنشاء نسخة مستند
     */
    createDocumentCopy: async (categoryId, documentId, copyNumber) => {
        return await window.electronAPI.createDocumentCopy(categoryId, documentId, copyNumber);
    },
    
    /**
     * حذف نسخة مستند
     */
    deleteDocumentCopy: async (categoryId, documentId, copyNumber) => {
        return await window.electronAPI.deleteDocumentCopy(categoryId, documentId, copyNumber);
    },
    
    /**
     * فتح مجلد نسخ المستند
     */
    openCopiesFolder: async (categoryId, documentId) => {
        return await window.electronAPI.openCopiesFolder(categoryId, documentId);
    },
    
    /**
     * الحصول على عدد نسخ المستند
     */
    getDocumentCopiesCount: async (categoryId, documentId) => {
        return await window.electronAPI.getDocumentCopiesCount(categoryId, documentId);
    },
    
    // ========== Thumbnail Operations ==========
    
    /**
     * توليد صورة مصغرة
     */
    generateThumbnail: async (filePath) => {
        return await window.electronAPI.generateThumbnail(filePath);
    },
    
    /**
     * الحصول على مسار الصورة المصغرة
     */
    getThumbnailPath: async (filePath) => {
        return await window.electronAPI.getThumbnailPath(filePath);
    },
    
    /**
     * فحص وجود صورة مصغرة
     */
    thumbnailExists: async (filePath) => {
        return await window.electronAPI.thumbnailExists(filePath);
    },
    
    /**
     * تنظيف الصور المصغرة القديمة
     */
    cleanupOldThumbnails: async () => {
        return await window.electronAPI.cleanupOldThumbnails();
    },
    
    /**
     * الحصول على صورة مصغرة مع التخزين المؤقت
     */
    getThumbnailForFile: async (filePath, fileModTime) => {
        return await window.electronAPI.getThumbnailForFile(filePath, fileModTime);
    },
    
    // ========== Print Operations ==========
    
    /**
     * طباعة ملف واحد
     */
    printFile: async (filePath) => {
        return await window.electronAPI.printFile(filePath);
    },
    
    /**
     * طباعة ملفات متعددة
     */
    printMultipleFiles: async (filePaths) => {
        return await window.electronAPI.printMultipleFiles(filePaths);
    },
    
    /**
     * دمج ملفات Word
     */
    mergeWordFiles: async (filePaths, outputPath) => {
        return await window.electronAPI.mergeWordFiles(filePaths, outputPath);
    },
    
    /**
     * دمج وطباعة
     */
    mergeAndPrint: async (filePaths) => {
        return await window.electronAPI.mergeAndPrint(filePaths);
    },
    
    // ========== Fax Operations ==========
    
    /**
     * معالجة PDF إلى صور
     */
    processPdfToImages: async (pdfPath, outputDir) => {
        return await window.electronAPI.processPdfToImages(pdfPath, outputDir);
    },
    
    /**
     * حفظ صفحة فاكس
     */
    saveFaxPage: async (imageData, faxId, pageNum) => {
        return await window.electronAPI.saveFaxPage(imageData, faxId, pageNum);
    },
    
    /**
     * حذف صفحة فاكس
     */
    deleteFaxPage: async (faxId, pageNum) => {
        return await window.electronAPI.deleteFaxPage(faxId, pageNum);
    },
    
    /**
     * الحصول على مسار صفحة فاكس
     */
    getFaxPagePath: async (faxId, pageNum) => {
        return await window.electronAPI.getFaxPagePath(faxId, pageNum);
    },
    
    // ========== Emoji Images ==========
    
    /**
     * الحصول على مسار صور الإيموجي
     */
    getEmojiImagesPath: async () => {
        return await window.electronAPI.getEmojiImagesPath();
    },
    
    // ========== Window Controls ==========
    
    /**
     * تصغير النافذة
     */
    minimizeWindow: () => {
        window.electronAPI.minimizeWindow();
    },
    
    /**
     * تكبير النافذة
     */
    maximizeWindow: () => {
        window.electronAPI.maximizeWindow();
    },
    
    /**
     * إغلاق النافذة
     */
    closeWindow: () => {
        window.electronAPI.closeWindow();
    }
};

export default electronAPI;
