/**
 * Electron API Wrapper
 * يوفر fallback للمتصفح عندما لا يكون Electron متاحاً
 * Provides browser fallback when Electron is not available
 */

// تحقق من وجود Electron API
const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI;
};

// Browser Storage Keys
const STORAGE_KEYS = {
  DATA: 'army_system_data',
  SETTINGS: 'army_system_settings',
  TEMPLATES: 'army_system_templates'
};

/**
 * Data Operations - عمليات البيانات
 */
export const dataAPI = {
  /**
   * تحميل البيانات
   * Load data from storage
   */
  async loadData() {
    if (isElectron()) {
      return await window.electronAPI.loadData();
    }
    
    // Browser fallback - استخدام localStorage
    try {
      const dataStr = localStorage.getItem(STORAGE_KEYS.DATA);
      const data = dataStr ? JSON.parse(dataStr) : {
        reminders: [],
        templates: [],
        lists: [],
        recentFiles: []
      };
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return {
        success: false,
        error: error.message,
        data: {
          reminders: [],
          templates: [],
          lists: [],
          recentFiles: []
        }
      };
    }
  },

  /**
   * حفظ البيانات
   * Save data to storage
   */
  async saveData(data) {
    if (isElectron()) {
      return await window.electronAPI.saveData(data);
    }
    
    // Browser fallback
    try {
      localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(data));
      return {
        success: true,
        message: 'تم حفظ البيانات بنجاح'
      };
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * نسخ احتياطي للبيانات
   * Backup data
   */
  async backupData() {
    if (isElectron()) {
      return await window.electronAPI.backupData();
    }
    
    // Browser fallback - تحميل ملف JSON
    try {
      const result = await this.loadData();
      if (result.success) {
        const dataStr = JSON.stringify(result.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `army_system_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        return {
          success: true,
          message: 'تم إنشاء النسخة الاحتياطية'
        };
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * استعادة البيانات
   * Restore data from backup
   */
  async restoreData(backupPath) {
    if (isElectron()) {
      return await window.electronAPI.restoreData(backupPath);
    }
    
    // Browser fallback - يطلب من المستخدم رفع ملف
    return {
      success: false,
      error: 'استعادة البيانات تتطلب Electron. استخدم زر "استيراد" بدلاً من ذلك.'
    };
  },

  /**
   * مسح جميع البيانات
   * Clear all data
   */
  async clearData() {
    if (isElectron()) {
      return await window.electronAPI.clearData();
    }
    
    // Browser fallback
    try {
      localStorage.removeItem(STORAGE_KEYS.DATA);
      return {
        success: true,
        message: 'تم مسح جميع البيانات'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

/**
 * File Operations - عمليات الملفات
 */
export const fileAPI = {
  /**
   * اختيار ملف
   * Select a file
   */
  async selectFile(filters) {
    if (isElectron()) {
      return await window.electronAPI.selectFile(filters);
    }
    
    // Browser fallback - استخدام input[type="file"]
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      
      // تطبيق الفلاتر إذا وجدت
      if (filters && filters.filters) {
        const extensions = filters.filters
          .flatMap(f => f.extensions)
          .map(ext => `.${ext}`)
          .join(',');
        input.accept = extensions;
      }
      
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // قراءة الملف كـ data URL للمعاينة
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              success: true,
              canceled: false,
              fileName: file.name,
              filePath: file.name, // في المتصفح، نستخدم الاسم فقط
              fileSize: file.size,
              fileType: file.type,
              file: file, // نحتفظ بالملف الأصلي
              dataUrl: event.target.result // للمعاينة
            });
          };
          reader.readAsDataURL(file);
        } else {
          resolve({
            success: true,
            canceled: true
          });
        }
      };
      
      input.oncancel = () => {
        resolve({
          success: true,
          canceled: true
        });
      };
      
      input.click();
    });
  },

  /**
   * اختيار عدة ملفات
   * Select multiple files
   */
  async selectMultipleFiles(filters) {
    if (isElectron()) {
      return await window.electronAPI.selectMultipleFiles(filters);
    }
    
    // Browser fallback
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      
      if (filters && filters.filters) {
        const extensions = filters.filters
          .flatMap(f => f.extensions)
          .map(ext => `.${ext}`)
          .join(',');
        input.accept = extensions;
      }
      
      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          const fileInfos = files.map(file => ({
            fileName: file.name,
            filePath: file.name,
            fileSize: file.size,
            fileType: file.type,
            file: file
          }));
          
          resolve({
            success: true,
            canceled: false,
            files: fileInfos
          });
        } else {
          resolve({
            success: true,
            canceled: true,
            files: []
          });
        }
      };
      
      input.click();
    });
  },

  /**
   * اختيار مجلد
   * Select a folder
   */
  async selectFolder(title) {
    if (isElectron()) {
      return await window.electronAPI.selectFolder(title);
    }
    
    // Browser fallback - المتصفح لا يدعم اختيار المجلدات بشكل كامل
    alert('اختيار المجلدات متاح فقط في نسخة Electron');
    return {
      success: false,
      canceled: true,
      error: 'اختيار المجلدات غير مدعوم في المتصفح'
    };
  },

  /**
   * فتح ملف
   * Open a file with default application
   */
  async openFile(filePath) {
    if (isElectron()) {
      return await window.electronAPI.openFile(filePath);
    }
    
    // Browser fallback - لا يمكن فتح ملفات محلية
    console.warn('فتح الملفات متاح فقط في Electron');
    return {
      success: false,
      error: 'فتح الملفات غير مدعوم في المتصفح'
    };
  }
};

/**
 * Settings Operations - عمليات الإعدادات
 */
export const settingsAPI = {
  /**
   * تحميل الإعدادات
   * Load settings
   */
  async loadSettings() {
    if (isElectron()) {
      return await window.electronAPI.loadSettings();
    }
    
    // Browser fallback
    try {
      const settingsStr = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const settings = settingsStr ? JSON.parse(settingsStr) : {
        theme: 'light',
        language: 'ar',
        savePath: '',
        autoBackup: false
      };
      
      return {
        success: true,
        settings: settings
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        settings: {
          theme: 'light',
          language: 'ar',
          savePath: '',
          autoBackup: false
        }
      };
    }
  },

  /**
   * حفظ الإعدادات
   * Save settings
   */
  async saveSettings(settings) {
    if (isElectron()) {
      return await window.electronAPI.saveSettings(settings);
    }
    
    // Browser fallback
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return {
        success: true,
        message: 'تم حفظ الإعدادات'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * إعادة تعيين الإعدادات
   * Reset settings to defaults
   */
  async resetSettings() {
    if (isElectron()) {
      return await window.electronAPI.resetSettings();
    }
    
    // Browser fallback
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      return {
        success: true,
        message: 'تم إعادة تعيين الإعدادات'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

/**
 * Print Operations - عمليات الطباعة
 */
export const printAPI = {
  /**
   * طباعة ملف
   * Print a file
   */
  async printFile(filePath) {
    if (isElectron()) {
      return await window.electronAPI.printFile(filePath);
    }
    
    // Browser fallback - استخدام window.print()
    window.print();
    return {
      success: true,
      message: 'تم فتح نافذة الطباعة'
    };
  },

  /**
   * طباعة عدة ملفات
   * Print multiple files
   */
  async printMultipleFiles(filePaths) {
    if (isElectron()) {
      return await window.electronAPI.printMultipleFiles(filePaths);
    }
    
    alert('طباعة عدة ملفات متاحة فقط في نسخة Electron');
    return {
      success: false,
      error: 'طباعة عدة ملفات غير مدعومة في المتصفح'
    };
  }
};

/**
 * Window Operations - عمليات النافذة
 */
export const windowAPI = {
  /**
   * تصغير النافذة
   * Minimize window
   */
  async minimizeWindow() {
    if (isElectron()) {
      return await window.electronAPI.minimizeWindow();
    }
    console.log('التحكم في النوافذ متاح فقط في Electron');
  },

  /**
   * تكبير/استعادة النافذة
   * Maximize/restore window
   */
  async maximizeWindow() {
    if (isElectron()) {
      return await window.electronAPI.maximizeWindow();
    }
    console.log('التحكم في النوافذ متاح فقط في Electron');
  },

  /**
   * إغلاق النافذة
   * Close window
   */
  async closeWindow() {
    if (isElectron()) {
      return await window.electronAPI.closeWindow();
    }
    window.close();
  },

  /**
   * التحقق من حالة التكبير
   * Check if window is maximized
   */
  async isMaximized() {
    if (isElectron()) {
      return await window.electronAPI.isMaximized();
    }
    return false;
  }
};

/**
 * Utility function - دالة مساعدة
 */
export const getEnvironment = () => {
  return isElectron() ? 'electron' : 'browser';
};

export const showEnvironmentInfo = () => {
  const env = getEnvironment();
  console.log(`🖥️ البيئة الحالية: ${env === 'electron' ? 'Electron' : 'متصفح'}`);
  console.log(`📦 الميزات المتاحة: ${env === 'electron' ? 'جميع الميزات' : 'ميزات محدودة (localStorage)'}`);
};

// Default export
export default {
  data: dataAPI,
  file: fileAPI,
  settings: settingsAPI,
  print: printAPI,
  window: windowAPI,
  isElectron,
  getEnvironment,
  showEnvironmentInfo
};


// Export unified electronAPI for backward compatibility
export const electronAPI = window.electronAPI || {
  // File operations
  selectFile: async (filters) => fileAPI.selectFile(filters),
  selectFolder: async (title) => fileAPI.selectFolder(title),
  selectMultipleFiles: async (filters) => fileAPI.selectMultipleFiles(filters),
  openFile: async (filePath) => fileAPI.openFile(filePath),
  openFolder: async () => ({ success: false, error: 'Electron not available' }),
  copyFile: async () => ({ success: false, error: 'Electron not available' }),
  deleteFile: async () => ({ success: false, error: 'Electron not available' }),
  fileExists: async () => ({ success: false, error: 'Electron not available' }),
  getFileInfo: async () => ({ success: false, error: 'Electron not available' }),
  showItemInFolder: async (filePath) => {
    if (window.electronAPI && window.electronAPI.showItemInFolder) {
      return await window.electronAPI.showItemInFolder(filePath);
    }
    // Browser fallback
    console.warn('عرض مسار الملف متاح فقط في Electron');
    alert('عرض مسار الملف متاح فقط في نسخة Electron Desktop');
    return {
      success: false,
      error: 'عرض مسار الملف غير مدعوم في المتصفح'
    };
  },
  
  // Data operations
  loadData: async () => dataAPI.loadData(),
  saveData: async (data) => dataAPI.saveData(data),
  
  // Asset operations - Browser fallback
  copyFileToAssets: async (sourcePath, categoryId, documentId) => {
    // في بيئة المتصفح، نقوم بإنشاء اسم ملف فريد ونحفظ المعلومات
    const timestamp = Date.now();
    const fileName = `${categoryId}_${documentId}_${timestamp}`;
    
    return {
      success: true,
      fileName: fileName,
      message: 'تم إضافة الملف بنجاح (Browser mode)'
    };
  },
  deleteFileFromAssets: async (relativePath) => {
    // في بيئة المتصفح، الملفات محفوظة في localStorage فقط
    return {
      success: true,
      message: 'تم حذف الملف بنجاح (Browser mode)'
    };
  },
  
  // Document operations - Browser fallback
  openDocument: async (filePath) => {
    // في بيئة المتصفح، لا يمكن فتح الملفات المحلية
    console.warn('فتح المستندات متاح فقط في نسخة Electron');
    alert('فتح المستندات متاح فقط في نسخة Electron Desktop');
    return {
      success: false,
      error: 'فتح المستندات غير مدعوم في المتصفح'
    };
  },
  getTodayFiles: async () => ({ success: false, files: [], error: 'Electron not available' }),
  openTodayCopiesFolder: async () => ({ success: false, error: 'Electron not available' }),
  createDocumentCopy: async () => ({ success: false, error: 'Electron not available' }),
  deleteDocumentCopy: async () => ({ success: false, error: 'Electron not available' }),
  openCopiesFolder: async () => ({ success: false, error: 'Electron not available' }),
  getDocumentCopiesCount: async () => ({ success: false, count: 0, error: 'Electron not available' })
};
