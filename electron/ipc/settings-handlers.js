const { ipcMain, app } = require('electron');
const fs = require('fs').promises;
const path = require('path');

/**
 * Settings Handlers - معالجات الإعدادات
 * حفظ وتحميل إعدادات التطبيق
 */

function registerSettingsHandlers() {
  
  // الحصول على مسار ملف الإعدادات
  function getSettingsPath() {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'settings.json');
  }

  // تحميل الإعدادات
  ipcMain.handle('settings:load', async () => {
    try {
      const settingsPath = getSettingsPath();
      
      // التحقق من وجود الملف
      try {
        await fs.access(settingsPath);
      } catch {
        // الملف غير موجود، إرجاع إعدادات افتراضية
        const defaultSettings = {
          savePath: '',
          dateFormat: 'DD-MM-YYYY',
          customPattern: ''
        };
        return {
          success: true,
          settings: defaultSettings,
          isDefault: true
        };
      }

      // قراءة الملف
      const data = await fs.readFile(settingsPath, 'utf8');
      const settings = JSON.parse(data);

      return {
        success: true,
        settings: settings,
        isDefault: false
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        success: false,
        error: error.message,
        settings: {
          savePath: '',
          dateFormat: 'DD-MM-YYYY',
          customPattern: ''
        }
      };
    }
  });

  // حفظ الإعدادات
  ipcMain.handle('settings:save', async (event, settings) => {
    try {
      const settingsPath = getSettingsPath();
      
      // التأكد من وجود المجلد
      const settingsDir = path.dirname(settingsPath);
      await fs.mkdir(settingsDir, { recursive: true });

      // حفظ الإعدادات
      await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8');

      return {
        success: true,
        message: 'Settings saved successfully'
      };
    } catch (error) {
      console.error('Error saving settings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // إعادة تعيين الإعدادات إلى الافتراضية
  ipcMain.handle('settings:reset', async () => {
    try {
      const settingsPath = getSettingsPath();
      
      const defaultSettings = {
        savePath: '',
        dateFormat: 'DD-MM-YYYY',
        customPattern: ''
      };

      // حفظ الإعدادات الافتراضية
      await fs.writeFile(settingsPath, JSON.stringify(defaultSettings, null, 2), 'utf8');

      return {
        success: true,
        settings: defaultSettings
      };
    } catch (error) {
      console.error('Error resetting settings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // الحصول على مسار الإعدادات (للتصدير/الاستيراد)
  ipcMain.handle('settings:getPath', async () => {
    try {
      const settingsPath = getSettingsPath();
      return {
        success: true,
        path: settingsPath
      };
    } catch (error) {
      console.error('Error getting settings path:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });
}

module.exports = { registerSettingsHandlers };
