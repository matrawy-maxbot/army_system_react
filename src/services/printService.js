/**
 * printService.js
 * خدمات الطباعة
 * نسخة من المنطق في script.js بدون تغيير
 */

import { electronAPI } from './electronAPI.js';

/**
 * طباعة ملف واحد
 * نسخة من printSingleFile في script.js
 */
export async function printFile(filePath) {
    try {
        console.log('🖨️ Printing file:', filePath);
        const result = await electronAPI.printFile(filePath);
        
        if (result.success) {
            console.log('✅ Print successful');
        } else {
            console.error('❌ Print failed:', result.error);
        }
        
        return result;
    } catch (error) {
        console.error('❌ Error printing file:', error);
        return { success: false, error: error.message };
    }
}

/**
 * طباعة ملفات متعددة
 * نسخة من printMultipleFiles في script.js
 */
export async function printMultipleFiles(filePaths) {
    try {
        console.log('🖨️ Printing multiple files:', filePaths.length);
        const result = await electronAPI.printMultipleFiles(filePaths);
        
        if (result.success) {
            console.log('✅ Print successful');
        } else {
            console.error('❌ Print failed:', result.error);
        }
        
        return result;
    } catch (error) {
        console.error('❌ Error printing multiple files:', error);
        return { success: false, error: error.message };
    }
}

/**
 * دمج ملفات Word
 */
export async function mergeWordFiles(filePaths, outputPath) {
    try {
        console.log('📄 Merging Word files:', filePaths.length);
        const result = await electronAPI.mergeWordFiles(filePaths, outputPath);
        
        if (result.success) {
            console.log('✅ Merge successful');
        } else {
            console.error('❌ Merge failed:', result.error);
        }
        
        return result;
    } catch (error) {
        console.error('❌ Error merging files:', error);
        return { success: false, error: error.message };
    }
}

/**
 * دمج وطباعة ملفات متعددة
 * نسخة من mergeAndPrint في script.js
 */
export async function mergeAndPrint(filePaths) {
    try {
        console.log('🖨️📄 Merging and printing files:', filePaths.length);
        const result = await electronAPI.mergeAndPrint(filePaths);
        
        if (result.success) {
            console.log('✅ Merge and print successful');
        } else {
            console.error('❌ Merge and print failed:', result.error);
        }
        
        return result;
    } catch (error) {
        console.error('❌ Error merging and printing files:', error);
        return { success: false, error: error.message };
    }
}

/**
 * طباعة ملفات محددة
 * نسخة من printSelectedFiles في script.js
 */
export async function printSelectedFiles(selectedFilePaths) {
    if (!selectedFilePaths || selectedFilePaths.length === 0) {
        console.warn('⚠️ No files selected for printing');
        return { success: false, error: 'No files selected' };
    }
    
    console.log('🖨️ Printing selected files:', selectedFilePaths.length);
    
    if (selectedFilePaths.length === 1) {
        // طباعة ملف واحد
        return await printFile(selectedFilePaths[0]);
    } else {
        // طباعة ملفات متعددة
        return await printMultipleFiles(selectedFilePaths);
    }
}

/**
 * دمج وطباعة ملفات محددة
 */
export async function mergeAndPrintSelected(selectedFilePaths) {
    if (!selectedFilePaths || selectedFilePaths.length === 0) {
        console.warn('⚠️ No files selected for merge and print');
        return { success: false, error: 'No files selected' };
    }
    
    if (selectedFilePaths.length === 1) {
        // ملف واحد فقط - طباعة مباشرة
        return await printFile(selectedFilePaths[0]);
    }
    
    // دمج وطباعة
    return await mergeAndPrint(selectedFilePaths);
}

export default {
    printFile,
    printMultipleFiles,
    mergeWordFiles,
    mergeAndPrint,
    printSelectedFiles,
    mergeAndPrintSelected
};
