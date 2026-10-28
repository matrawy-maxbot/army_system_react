const { ipcMain, app } = require('electron');
const fs = require('fs').promises;
const path = require('path');

/**
 * Data Handlers - معالجات البيانات
 * حفظ وتحميل بيانات التطبيق (الفئات، المستندات، الفاكسات، إلخ)
 */

function registerDataHandlers() {
  
  // الحصول على مسار ملف البيانات
  function getDataPath() {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'data.json');
  }

  // تحميل البيانات
  ipcMain.handle('data:load', async () => {
    try {
      const dataPath = getDataPath();
      
      // التحقق من وجود الملف
      try {
        await fs.access(dataPath);
      } catch {
        // الملف غير موجود، إرجاع بيانات افتراضية
        const defaultData = {
          categories: [],
          otherDocuments: [],
          originalFax: null,
          faxPages: [],
          filteredFaxes: [],
          currentFilteringSession: { isActive: false, nextFaxNumber: 1 },
          replies: [],
          reminders: [],
          lists: [{id: 1, name: "المفضلة", isDefault: true, items: []}],
          templates: []
        };
        return {
          success: true,
          data: defaultData,
          isDefault: true
        };
      }

      // قراءة الملف
      const data = await fs.readFile(dataPath, 'utf8');
      const appData = JSON.parse(data);

      return {
        success: true,
        data: appData,
        isDefault: false
      };
    } catch (error) {
      console.error('Error loading data:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  });

  // حفظ البيانات
  ipcMain.handle('data:save', async (event, data) => {
    try {
      const dataPath = getDataPath();
      
      // التأكد من وجود المجلد
      const dataDir = path.dirname(dataPath);
      await fs.mkdir(dataDir, { recursive: true });

      // حفظ البيانات
      await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');

      return {
        success: true,
        message: 'Data saved successfully'
      };
    } catch (error) {
      console.error('Error saving data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // إنشاء نسخة احتياطية من البيانات
  ipcMain.handle('data:backup', async () => {
    try {
      const dataPath = getDataPath();
      const backupPath = dataPath.replace('.json', `_backup_${Date.now()}.json`);
      
      // التحقق من وجود الملف الأصلي
      try {
        await fs.access(dataPath);
      } catch {
        return {
          success: false,
          error: 'No data file to backup'
        };
      }

      // نسخ الملف
      await fs.copyFile(dataPath, backupPath);

      return {
        success: true,
        backupPath: backupPath
      };
    } catch (error) {
      console.error('Error creating backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // استعادة من نسخة احتياطية
  ipcMain.handle('data:restore', async (event, backupPath) => {
    try {
      const dataPath = getDataPath();
      
      // التحقق من وجود ملف النسخة الاحتياطية
      try {
        await fs.access(backupPath);
      } catch {
        return {
          success: false,
          error: 'Backup file not found'
        };
      }

      // نسخ النسخة الاحتياطية إلى الملف الرئيسي
      await fs.copyFile(backupPath, dataPath);

      // قراءة البيانات المستعادة
      const data = await fs.readFile(dataPath, 'utf8');
      const appData = JSON.parse(data);

      return {
        success: true,
        data: appData,
        message: 'Data restored successfully'
      };
    } catch (error) {
      console.error('Error restoring data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // الحصول على مسار البيانات (للتصدير/الاستيراد)
  ipcMain.handle('data:getPath', async () => {
    try {
      const dataPath = getDataPath();
      return {
        success: true,
        path: dataPath
      };
    } catch (error) {
      console.error('Error getting data path:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // مسح جميع البيانات
  ipcMain.handle('data:clear', async () => {
    try {
      const dataPath = getDataPath();
      
      // إنشاء نسخة احتياطية أولاً
      const backupPath = dataPath.replace('.json', `_backup_before_clear_${Date.now()}.json`);
      try {
        await fs.copyFile(dataPath, backupPath);
      } catch {
        // لا يوجد ملف لنسخه احتياطياً
      }

      // مسح الملف
      try {
        await fs.unlink(dataPath);
      } catch {
        // الملف غير موجود بالفعل
      }

      return {
        success: true,
        backupPath: backupPath,
        message: 'Data cleared successfully'
      };
    } catch (error) {
      console.error('Error clearing data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });
}

module.exports = { registerDataHandlers };
