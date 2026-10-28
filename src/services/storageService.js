/**
 * storageService.js
 * خدمات التخزين المحلي
 * نسخة من المنطق في script.js بدون تغيير
 */

import { electronAPI } from './electronAPI.js';

/**
 * تحميل البيانات من storage
 * نسخة من loadData في script.js
 */
export async function loadData() {
    try {
        const result = await electronAPI.loadData();
        if (result.success && result.data) {
            // Clean up old daily tasks data - we no longer use them
            const cleanedData = { ...result.data };
            delete cleanedData.dailyTasks;
            delete cleanedData.finishedTasks;
            
            const appState = { 
                dailyTasks: [],
                categories: cleanedData.categories || [],
                otherDocuments: cleanedData.otherDocuments || [],
                finishedTasks: [],
                currentTask: null,
                currentCategory: null,
                // تحميل البيانات الجديدة
                originalFax: cleanedData.originalFax || null,
                faxPages: cleanedData.faxPages || [],
                filteredFaxes: cleanedData.filteredFaxes || [],
                currentFilteringSession: cleanedData.currentFilteringSession || { isActive: false, nextFaxNumber: 1 },
                replies: cleanedData.replies || [],
                reminders: cleanedData.reminders || [],
                lists: cleanedData.lists || [{id: 1, name: "المفضلة", isDefault: true, items: []}],
                templates: cleanedData.templates || []
            };
            
            // إذا لم تكن هناك فئات، أنشئ فئة افتراضية
            if (appState.categories.length === 0) {
                appState.categories = [
                    {
                        id: Date.now(),
                        name: 'المستندات',
                        icon: '<svg class="svg-icon-md" style="display:inline-block;" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" /></svg>',
                        documents: appState.otherDocuments || []
                    }
                ];
                // نقل المستندات القديمة إلى الفئة الافتراضية
                appState.categories[0].documents = appState.otherDocuments || [];
            }
            
            // التأكد من وجود قائمة المفضلة
            if (!appState.lists || appState.lists.length === 0) {
                appState.lists = [{id: 1, name: "المفضلة", isDefault: true, items: []}];
            }
            
            return { success: true, data: appState };
        } else {
            // Initialize with default category
            const defaultState = {
                dailyTasks: [],
                categories: [
                    {
                        id: Date.now(),
                        name: 'المستندات',
                        icon: '<svg class="svg-icon-md" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" /></svg>',
                        documents: []
                    }
                ],
                otherDocuments: [],
                finishedTasks: [],
                currentTask: null,
                currentCategory: null,
                originalFax: null,
                faxPages: [],
                filteredFaxes: [],
                currentFilteringSession: { isActive: false, nextFaxNumber: 1 },
                replies: [],
                reminders: [],
                lists: [{id: 1, name: "المفضلة", isDefault: true, items: []}],
                templates: []
            };
            return { success: true, data: defaultState };
        }
    } catch (error) {
        console.error('Error loading data:', error);
        return { success: false, error: error.message };
    }
}

/**
 * حفظ البيانات إلى storage
 * نسخة من saveData في script.js
 */
export async function saveData(appState) {
    try {
        await electronAPI.saveData(appState);
        return { success: true };
    } catch (error) {
        console.error('Error saving data:', error);
        return { success: false, error: error.message };
    }
}

/**
 * تحميل الإعدادات من settings.json
 * نسخة من loadSettings في script.js
 */
export async function loadSettings() {
    try {
        const result = await electronAPI.loadSettings();
        if (result.success && result.settings) {
            console.log('✅ Settings loaded:', result.settings);
            return { success: true, settings: result.settings };
        } else {
            console.warn('⚠️ Using default settings');
            const defaultSettings = {
                savePath: '',
                dateFormat: 'DD-MM-YYYY',
                customPattern: ''
            };
            return { success: true, settings: defaultSettings };
        }
    } catch (error) {
        console.error('❌ Error loading settings:', error);
        const defaultSettings = {
            savePath: '',
            dateFormat: 'DD-MM-YYYY',
            customPattern: ''
        };
        return { success: false, error: error.message, settings: defaultSettings };
    }
}

/**
 * حفظ الإعدادات إلى settings.json
 * نسخة من saveSettings في script.js
 */
export async function saveSettings(appSettings) {
    try {
        const result = await electronAPI.saveSettings(appSettings);
        if (result.success) {
            console.log('✅ Settings saved successfully');
            return { success: true };
        } else {
            console.error('❌ Failed to save settings:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Error saving settings:', error);
        return { success: false, error: error.message };
    }
}

export default {
    loadData,
    saveData,
    loadSettings,
    saveSettings
};
