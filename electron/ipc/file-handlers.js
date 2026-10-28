const { ipcMain, dialog, BrowserWindow } = require('electron');
const fs = require('fs').promises;
const path = require('path');

/**
 * File Handlers - معالجات الملفات
 * تسجيل جميع handlers المتعلقة بعمليات الملفات
 */

function registerFileHandlers() {
  
  // اختيار ملف واحد
  ipcMain.handle('select-file', async (event, filters) => {
    const options = filters || {};
    try {
      const mainWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
      const result = await dialog.showOpenDialog(mainWindow, {
        title: options.title || 'اختر ملفاً',
        properties: ['openFile'],
        filters: options.filters || [
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled) {
        return { success: true, canceled: true };
      }

      const filePath = result.filePaths[0];
      const fileName = path.basename(filePath);
      
      return {
        success: true,
        canceled: false,
        filePath,
        fileName
      };
    } catch (error) {
      console.error('Error selecting file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // اختيار ملفات متعددة
  ipcMain.handle('select-multiple-files', async (event, filters) => {
    const options = filters || {};
    try {
      const mainWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
      const result = await dialog.showOpenDialog(mainWindow, {
        title: options.title || 'اختر ملفات',
        properties: ['openFile', 'multiSelections'],
        filters: options.filters || [
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled) {
        return { success: true, canceled: true, filePaths: [] };
      }

      return {
        success: true,
        canceled: false,
        filePaths: result.filePaths
      };
    } catch (error) {
      console.error('Error selecting multiple files:', error);
      return {
        success: false,
        error: error.message,
        filePaths: []
      };
    }
  });

  // اختيار مجلد
  ipcMain.handle('select-folder', async (event, title) => {
    title = title || 'اختر مجلداً';
    try {
      const mainWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
      const result = await dialog.showOpenDialog(mainWindow, {
        title,
        properties: ['openDirectory']
      });

      if (result.canceled) {
        return { success: true, canceled: true };
      }

      return {
        success: true,
        canceled: false,
        folderPath: result.filePaths[0]
      };
    } catch (error) {
      console.error('Error selecting folder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // فتح ملف في التطبيق الافتراضي
  ipcMain.handle('open-file', async (event, filePath) => {
    try {
      const { shell } = require('electron');
      await shell.openPath(filePath);
      return { success: true };
    } catch (error) {
      console.error('Error opening file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // فتح مجلد في مستكشف الملفات
  ipcMain.handle('open-folder', async (event, folderPath) => {
    try {
      const { shell } = require('electron');
      await shell.openPath(folderPath);
      return { success: true };
    } catch (error) {
      console.error('Error opening folder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // نسخ ملف
  ipcMain.handle('copy-file', async (event, source, destination) => {
    try {
      // إنشاء المجلد الوجهة إذا لم يكن موجوداً
      const destDir = path.dirname(destination);
      await fs.mkdir(destDir, { recursive: true });

      // نسخ الملف
      await fs.copyFile(source, destination);
      
      return { success: true };
    } catch (error) {
      console.error('Error copying file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // حذف ملف
  ipcMain.handle('delete-file', async (event, filePath) => {
    try {
      await fs.unlink(filePath);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // التحقق من وجود ملف
  ipcMain.handle('file-exists', async (event, filePath) => {
    try {
      await fs.access(filePath);
      return { success: true, exists: true };
    } catch {
      return { success: true, exists: false };
    }
  });

  // الحصول على معلومات الملف
  ipcMain.handle('get-file-info', async (event, filePath) => {
    try {
      const stats = await fs.stat(filePath);
      return {
        success: true,
        info: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory()
        }
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // قراءة محتويات مجلد
  ipcMain.handle('read-directory', async (event, dirPath) => {
    try {
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      const fileList = files.map(file => ({
        name: file.name,
        isDirectory: file.isDirectory(),
        path: path.join(dirPath, file.name)
      }));

      return {
        success: true,
        files: fileList
      };
    } catch (error) {
      console.error('Error reading directory:', error);
      return {
        success: false,
        error: error.message,
        files: []
      };
    }
  });
}

module.exports = { registerFileHandlers };
