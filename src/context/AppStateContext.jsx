import React, { createContext, useState, useEffect, useContext } from 'react';

// إنشاء Context
const AppStateContext = createContext(null);

// Provider Component
export function AppStateProvider({ children }) {
    const [appState, setAppState] = useState({
        categories: [],
        archiveCategories: [], // نظام الأرشفة الجديد
        otherDocuments: [],
        originalFax: null,
        faxPages: [],
        filteredFaxes: [],
        currentFilteringSession: { isActive: false, nextFaxNumber: 1 },
        replies: [],
        reminders: [],
        tasks: [],
        lists: [{ id: 1, name: "المفضلة", isDefault: true, items: [] }],
        templates: []
    });

    const [isLoading, setIsLoading] = useState(true);

    // تحميل البيانات عند بدء التطبيق
    useEffect(() => {
        loadData();
    }, []);

    // تحميل البيانات
    const loadData = async () => {
        try {
            setIsLoading(true);
            
            let cleanedData = {};
            
            // Check if running in Electron
            if (window.electronAPI && window.electronAPI.loadData) {
                const result = await window.electronAPI.loadData();
                if (result.success && result.data) {
                    cleanedData = { ...result.data };
                }
            } else {
                // Use localStorage for browser mode
                const savedData = localStorage.getItem('army_system_data');
                if (savedData) {
                    cleanedData = JSON.parse(savedData);
                }
            }
            
            delete cleanedData.dailyTasks;
            delete cleanedData.finishedTasks;

            setAppState({
                categories: cleanedData.categories || [],
                archiveCategories: cleanedData.archiveCategories || [],
                otherDocuments: cleanedData.otherDocuments || [],
                originalFax: cleanedData.originalFax || null,
                faxPages: cleanedData.faxPages || [],
                filteredFaxes: cleanedData.filteredFaxes || [],
                currentFilteringSession: cleanedData.currentFilteringSession || { isActive: false, nextFaxNumber: 1 },
                replies: cleanedData.replies || [],
                reminders: cleanedData.reminders || [],
                tasks: cleanedData.tasks || [],
                lists: cleanedData.lists || [{ id: 1, name: "المفضلة", isDefault: true, items: [] }],
                templates: cleanedData.templates || []
            });

            // إذا لم تكن هناك فئات، أنشئ فئة افتراضية
            if (!cleanedData.categories || cleanedData.categories.length === 0) {
                const defaultCategory = {
                    id: Date.now(),
                    name: 'المستندات',
                    icon: '<svg class="svg-icon-md" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" /></svg>',
                    documents: cleanedData.otherDocuments || []
                };
                const newState = {
                    categories: [defaultCategory],
                    archiveCategories: [],
                    otherDocuments: cleanedData.otherDocuments || [],
                    originalFax: null,
                    faxPages: [],
                    filteredFaxes: [],
                    currentFilteringSession: { isActive: false, nextFaxNumber: 1 },
                    replies: [],
                    reminders: [],
                    tasks: [],
                    lists: [{ id: 1, name: "المفضلة", isDefault: true, items: [] }],
                    templates: []
                };
                setAppState(newState);
                await saveData(newState);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // حفظ البيانات
    const saveData = async (dataToSave = null) => {
        try {
            const data = dataToSave || appState;
            
            // Check if running in Electron
            if (window.electronAPI && window.electronAPI.saveData) {
                await window.electronAPI.saveData(data);
            } else {
                // Use localStorage for browser mode
                localStorage.setItem('army_system_data', JSON.stringify(data));
            }
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    };

    // تحديث الحالة وحفظها
    const updateState = async (updates) => {
        const newState = { ...appState, ...updates };
        setAppState(newState);
        await saveData(newState);
    };

    // ======== Category Operations ========
    const addCategory = async (category) => {
        const newCategory = {
            ...category,
            id: Date.now(),
            documents: []
        };
        await updateState({
            categories: [...appState.categories, newCategory]
        });
        return newCategory;
    };

    const updateCategory = async (categoryId, updates) => {
        await updateState({
            categories: appState.categories.map(cat =>
                cat.id === categoryId ? { ...cat, ...updates } : cat
            )
        });
    };

    const deleteCategory = async (categoryId) => {
        await updateState({
            categories: appState.categories.filter(cat => cat.id !== categoryId)
        });
    };

    // ======== Document Operations ========
    const addDocument = async (categoryId, document) => {
        const newDocument = {
            ...document,
            id: Date.now()
        };
        
        await updateState({
            categories: appState.categories.map(cat =>
                cat.id === categoryId
                    ? { ...cat, documents: [...cat.documents, newDocument] }
                    : cat
            )
        });
        return newDocument;
    };

    const updateDocument = async (categoryId, documentId, updates) => {
        await updateState({
            categories: appState.categories.map(cat =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        documents: cat.documents.map(doc =>
                            doc.id === documentId ? { ...doc, ...updates } : doc
                        )
                    }
                    : cat
            )
        });
    };

    const deleteDocument = async (categoryId, documentId) => {
        await updateState({
            categories: appState.categories.map(cat =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        documents: cat.documents.filter(doc => doc.id !== documentId)
                    }
                    : cat
            )
        });
    };

    // ======== Fax Operations ========
    const setOriginalFax = async (fax) => {
        await updateState({ originalFax: fax });
    };

    const addFilteredFax = async (fax) => {
        await updateState({
            filteredFaxes: [...appState.filteredFaxes, fax]
        });
    };

    const deleteFilteredFax = async (faxId) => {
        await updateState({
            filteredFaxes: appState.filteredFaxes.filter(f => f.id !== faxId)
        });
    };

    // ======== Reply Operations ========
    const addReply = async (reply) => {
        const newReply = {
            ...reply,
            id: Date.now()
        };
        await updateState({
            replies: [...appState.replies, newReply]
        });
        return newReply;
    };

    const deleteReply = async (replyId) => {
        await updateState({
            replies: appState.replies.filter(r => r.id !== replyId)
        });
    };

    // ======== Reminder Operations ========
    const addReminder = async (reminder) => {
        const newReminder = {
            ...reminder,
            id: Date.now()
        };
        await updateState({
            reminders: [...appState.reminders, newReminder]
        });
        return newReminder;
    };

    const updateReminder = async (reminderId, updates) => {
        await updateState({
            reminders: appState.reminders.map(r =>
                r.id === reminderId ? { ...r, ...updates } : r
            )
        });
    };

    const deleteReminder = async (reminderId) => {
        await updateState({
            reminders: appState.reminders.filter(r => r.id !== reminderId)
        });
    };

    // ======== List Operations ========
    const addList = async (list) => {
        const newList = {
            ...list,
            id: Date.now(),
            items: []
        };
        await updateState({
            lists: [...appState.lists, newList]
        });
        return newList;
    };

    const deleteList = async (listId) => {
        // لا تحذف قائمة المفضلة الافتراضية
        const list = appState.lists.find(l => l.id === listId);
        if (list && list.isDefault) return;
        
        await updateState({
            lists: appState.lists.filter(l => l.id !== listId)
        });
    };

    const addItemToList = async (listId, item) => {
        await updateState({
            lists: appState.lists.map(l =>
                l.id === listId
                    ? { ...l, items: [...l.items, item] }
                    : l
            )
        });
    };

    const removeItemFromList = async (listId, itemId) => {
        await updateState({
            lists: appState.lists.map(l =>
                l.id === listId
                    ? { ...l, items: l.items.filter(i => i.id !== itemId) }
                    : l
            )
        });
    };

    // ======== Template Operations ========
    const addTemplate = async (template) => {
        const newTemplate = {
            ...template,
            id: Date.now()
        };
        await updateState({
            templates: [...appState.templates, newTemplate]
        });
        return newTemplate;
    };

    const deleteTemplate = async (templateId) => {
        await updateState({
            templates: appState.templates.filter(t => t.id !== templateId)
        });
    };

    const value = {
        appState,
        setAppState, // إضافة setAppState للاستخدام المباشر
        isLoading,
        loadData,
        saveData,
        updateState,
        // Category operations
        addCategory,
        updateCategory,
        deleteCategory,
        // Document operations
        addDocument,
        updateDocument,
        deleteDocument,
        // Fax operations
        setOriginalFax,
        addFilteredFax,
        deleteFilteredFax,
        // Reply operations
        addReply,
        deleteReply,
        // Reminder operations
        addReminder,
        updateReminder,
        deleteReminder,
        // List operations
        addList,
        deleteList,
        addItemToList,
        removeItemFromList,
        // Template operations
        addTemplate,
        deleteTemplate
    };

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
}

// Custom Hook لاستخدام Context
export function useAppState() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within AppStateProvider');
    }
    return context;
}

export default AppStateContext;
