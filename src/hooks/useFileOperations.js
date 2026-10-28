import { useCallback } from 'react';

/**
 * Hook لعمليات الملفات (نسخ، حذف، نقل، فتح)
 * @returns {Object} - { copyFile, deleteFile, openFile, openFolder }
 */
export const useFileOperations = () => {
    // نسخ ملف
    const copyFile = useCallback(async (sourcePath, destinationPath) => {
        try {
            console.log('📋 Copying file:', sourcePath, 'to', destinationPath);
            const result = await window.electronAPI.copyFile(sourcePath, destinationPath);
            
            if (result.success) {
                console.log('✅ File copied successfully');
                return { success: true };
            } else {
                console.error('❌ Failed to copy file:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('❌ Error copying file:', error);
            return { success: false, error: error.message };
        }
    }, []);

    // حذف ملف
    const deleteFile = useCallback(async (filePath) => {
        try {
            console.log('🗑️ Deleting file:', filePath);
            const result = await window.electronAPI.deleteFile(filePath);
            
            if (result.success) {
                console.log('✅ File deleted successfully');
                return { success: true };
            } else {
                console.error('❌ Failed to delete file:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('❌ Error deleting file:', error);
            return { success: false, error: error.message };
        }
    }, []);

    // فتح ملف
    const openFile = useCallback(async (filePath) => {
        try {
            console.log('📂 Opening file:', filePath);
            const result = await window.electronAPI.openFile(filePath);
            
            if (result.success) {
                console.log('✅ File opened successfully');
                return { success: true };
            } else {
                console.error('❌ Failed to open file:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('❌ Error opening file:', error);
            return { success: false, error: error.message };
        }
    }, []);

    // فتح مجلد
    const openFolder = useCallback(async (folderPath) => {
        try {
            console.log('📁 Opening folder:', folderPath);
            const result = await window.electronAPI.openFolder(folderPath);
            
            if (result.success) {
                console.log('✅ Folder opened successfully');
                return { success: true };
            } else {
                console.error('❌ Failed to open folder:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('❌ Error opening folder:', error);
            return { success: false, error: error.message };
        }
    }, []);

    // نقل ملف (نسخ + حذف)
    const moveFile = useCallback(async (sourcePath, destinationPath) => {
        try {
            console.log('➡️ Moving file:', sourcePath, 'to', destinationPath);
            
            // نسخ الملف أولاً
            const copyResult = await copyFile(sourcePath, destinationPath);
            if (!copyResult.success) {
                return copyResult;
            }

            // حذف الملف الأصلي
            const deleteResult = await deleteFile(sourcePath);
            if (!deleteResult.success) {
                console.warn('⚠️ File copied but failed to delete original');
                return { success: true, warning: 'تم النسخ ولكن فشل حذف الملف الأصلي' };
            }

            console.log('✅ File moved successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Error moving file:', error);
            return { success: false, error: error.message };
        }
    }, [copyFile, deleteFile]);

    // التحقق من وجود ملف
    const fileExists = useCallback(async (filePath) => {
        try {
            const result = await window.electronAPI.fileExists(filePath);
            return result.exists || false;
        } catch (error) {
            console.error('❌ Error checking file existence:', error);
            return false;
        }
    }, []);

    // الحصول على معلومات ملف
    const getFileInfo = useCallback(async (filePath) => {
        try {
            const result = await window.electronAPI.getFileInfo(filePath);
            if (result.success) {
                return result.info;
            }
            return null;
        } catch (error) {
            console.error('❌ Error getting file info:', error);
            return null;
        }
    }, []);

    return {
        copyFile,
        deleteFile,
        openFile,
        openFolder,
        moveFile,
        fileExists,
        getFileInfo
    };
};
