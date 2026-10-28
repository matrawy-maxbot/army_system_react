const { ipcMain, shell } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * Document Handlers - معالجات المستندات
 * إدارة المستندات: نسخ، حذف، إنشاء نسخ جديدة
 */

function registerDocumentHandlers() {
  
  // نسخ ملف إلى مجلد assets
  ipcMain.handle('document:copyToAssets', async (event, sourcePath, destFolder, fileName) => {
    try {
      // مسار مجلد assets في المشروع
      const assetsPath = path.join(process.cwd(), 'assets', destFolder);
      
      // إنشاء المجلد إذا لم يكن موجوداً
      await fs.mkdir(assetsPath, { recursive: true });
      
      // المسار الكامل للملف الوجهة
      const destPath = path.join(assetsPath, fileName);
      
      // نسخ الملف
      await fs.copyFile(sourcePath, destPath);
      
      // إرجاع المسار النسبي
      const relativePath = path.join('assets', destFolder, fileName);
      
      return {
        success: true,
        relativePath: relativePath.replace(/\\/g, '/') // تحويل \ إلى /
      };
    } catch (error) {
      console.error('Error copying file to assets:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // حذف ملف
  ipcMain.handle('document:delete', async (event, filePath) => {
    try {
      await fs.unlink(filePath);
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // إنشاء نسخة من مستند
  ipcMain.handle('document:createCopy', async (event, documentInfo) => {
    try {
      const { originalFilePath, categoryName, documentName, copyNumber, savePath, dateStr } = documentInfo;
      
      // تحديد مسار الحفظ الأساسي
      const basePath = savePath || path.join(os.homedir(), 'Documents', 'ArmySystem');
      
      // بناء مسار المجلد: basePath/التاريخ/الفئة/المستند
      const dateFolderPath = path.join(basePath, dateStr);
      const categoryFolderPath = path.join(dateFolderPath, categoryName);
      const documentFolderPath = path.join(categoryFolderPath, documentName);
      
      // إنشاء جميع المجلدات
      await fs.mkdir(documentFolderPath, { recursive: true });
      
      // اسم الملف الجديد مع رقم النسخة
      const ext = path.extname(originalFilePath);
      const baseName = path.basename(originalFilePath, ext);
      const newFileName = `${baseName}_نسخة_${copyNumber}${ext}`;
      const newFilePath = path.join(documentFolderPath, newFileName);
      
      // نسخ الملف
      await fs.copyFile(originalFilePath, newFilePath);
      
      return {
        success: true,
        copyPath: newFilePath,
        copyNumber: copyNumber,
        fileName: newFileName
      };
    } catch (error) {
      console.error('Error creating document copy:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // حذف نسخة من مستند
  ipcMain.handle('document:deleteCopy', async (event, copyPath) => {
    try {
      await fs.unlink(copyPath);
      return { success: true };
    } catch (error) {
      console.error('Error deleting document copy:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // فتح مجلد النسخ الخاص بمستند
  ipcMain.handle('document:openCopiesFolder', async (event, folderInfo) => {
    try {
      const { categoryName, documentName, savePath, dateStr } = folderInfo;
      
      // تحديد مسار الحفظ الأساسي
      const basePath = savePath || path.join(os.homedir(), 'Documents', 'ArmySystem');
      
      // بناء مسار المجلد
      const folderPath = path.join(basePath, dateStr, categoryName, documentName);
      
      // التحقق من وجود المجلد
      try {
        await fs.access(folderPath);
      } catch {
        // إنشاء المجلد إذا لم يكن موجوداً
        await fs.mkdir(folderPath, { recursive: true });
      }
      
      // فتح المجلد
      await shell.openPath(folderPath);
      
      return { success: true, folderPath };
    } catch (error) {
      console.error('Error opening copies folder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // الحصول على ملفات اليوم
  ipcMain.handle('document:getTodayFiles', async (event, dateStr, savePath) => {
    try {
      // تحديد مسار الحفظ الأساسي
      const basePath = savePath || path.join(os.homedir(), 'Documents', 'ArmySystem');
      const dateFolderPath = path.join(basePath, dateStr);
      
      // التحقق من وجود المجلد
      try {
        await fs.access(dateFolderPath);
      } catch {
        return { success: true, files: [] };
      }
      
      // قراءة جميع الملفات بشكل تكراري
      const files = [];
      
      async function scanDirectory(dirPath, categoryName = '') {
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const item of items) {
          const itemPath = path.join(dirPath, item.name);
          
          if (item.isDirectory()) {
            // إذا كان مجلد، ادخل فيه
            const newCategory = categoryName || item.name;
            await scanDirectory(itemPath, newCategory);
          } else if (item.isFile()) {
            // إذا كان ملف، أضفه للقائمة
            const stats = await fs.stat(itemPath);
            files.push({
              name: item.name,
              path: itemPath,
              category: categoryName,
              time: stats.mtime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
              modified: stats.mtime
            });
          }
        }
      }
      
      await scanDirectory(dateFolderPath);
      
      // ترتيب الملفات حسب الوقت (الأحدث أولاً)
      files.sort((a, b) => b.modified - a.modified);
      
      return {
        success: true,
        files: files
      };
    } catch (error) {
      console.error('Error getting today files:', error);
      return {
        success: false,
        error: error.message,
        files: []
      };
    }
  });

  // فتح مجلد نسخ اليوم
  ipcMain.handle('document:openTodayFolder', async (event, dateStr, savePath) => {
    try {
      // تحديد مسار الحفظ الأساسي
      const basePath = savePath || path.join(os.homedir(), 'Documents', 'ArmySystem');
      const dateFolderPath = path.join(basePath, dateStr);
      
      // التحقق من وجود المجلد
      try {
        await fs.access(dateFolderPath);
      } catch {
        // إنشاء المجلد إذا لم يكن موجوداً
        await fs.mkdir(dateFolderPath, { recursive: true });
      }
      
      // فتح المجلد
      await shell.openPath(dateFolderPath);
      
      return { success: true, folderPath: dateFolderPath };
    } catch (error) {
      console.error('Error opening today folder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // الحصول على عدد النسخ لمستند
  ipcMain.handle('document:getCopiesCount', async (event, folderInfo) => {
    try {
      const { categoryName, documentName, savePath, dateStr } = folderInfo;
      
      // تحديد مسار الحفظ الأساسي
      const basePath = savePath || path.join(os.homedir(), 'Documents', 'ArmySystem');
      const folderPath = path.join(basePath, dateStr, categoryName, documentName);
      
      // التحقق من وجود المجلد
      try {
        await fs.access(folderPath);
      } catch {
        return { success: true, count: 0 };
      }
      
      // قراءة الملفات
      const files = await fs.readdir(folderPath);
      
      return {
        success: true,
        count: files.length
      };
    } catch (error) {
      console.error('Error getting copies count:', error);
      return {
        success: false,
        error: error.message,
        count: 0
      };
    }
  });
}

module.exports = { registerDocumentHandlers };
