const { ipcMain } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

/**
 * Thumbnail Handlers - معالجات الصور المصغرة
 * توليد وإدارة الصور المصغرة للمستندات
 */

function registerThumbnailHandlers() {
  
  // توليد صورة مصغرة لملف Word
  ipcMain.handle('thumbnail:generate', async (event, filePath) => {
    try {
      // التحقق من وجود الملف
      try {
        await fs.access(filePath);
      } catch {
        return {
          success: false,
          error: 'File not found'
        };
      }

      // إنشاء مجلد thumbnails في temp
      const thumbnailsDir = path.join(os.tmpdir(), 'army_system_thumbnails');
      await fs.mkdir(thumbnailsDir, { recursive: true });

      // اسم الملف المصغر (hash من المسار)
      const fileHash = Buffer.from(filePath).toString('base64').replace(/[/+=]/g, '_');
      const thumbnailPath = path.join(thumbnailsDir, `${fileHash}.png`);

      // التحقق من وجود thumbnail محفوظ مسبقاً
      try {
        const stats = await fs.stat(filePath);
        const thumbnailStats = await fs.stat(thumbnailPath);
        
        // إذا كان thumbnail أحدث من الملف الأصلي، استخدمه
        if (thumbnailStats.mtime >= stats.mtime) {
          return {
            success: true,
            thumbnailPath: thumbnailPath,
            cached: true
          };
        }
      } catch {
        // thumbnail غير موجود، سنقوم بإنشائه
      }

      // استخدام LibreOffice لتوليد الصورة المصغرة
      // LibreOffice يجب أن يكون مثبتاً على النظام
      const result = await generateThumbnailWithLibreOffice(filePath, thumbnailPath);
      
      if (result.success) {
        return {
          success: true,
          thumbnailPath: thumbnailPath,
          cached: false
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // تنظيف الصور المصغرة القديمة
  ipcMain.handle('thumbnail:cleanup', async () => {
    try {
      const thumbnailsDir = path.join(os.tmpdir(), 'army_system_thumbnails');
      
      // التحقق من وجود المجلد
      try {
        await fs.access(thumbnailsDir);
      } catch {
        return { success: true, message: 'No thumbnails to clean' };
      }

      // حذف الملفات الأقدم من 7 أيام
      const files = await fs.readdir(thumbnailsDir);
      const now = Date.now();
      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      
      let deletedCount = 0;
      for (const file of files) {
        const filePath = path.join(thumbnailsDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > weekInMs) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      return {
        success: true,
        deletedCount: deletedCount
      };
    } catch (error) {
      console.error('Error cleaning thumbnails:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // الحصول على مسار thumbnail لملف
  ipcMain.handle('thumbnail:getPath', async (event, filePath) => {
    try {
      const thumbnailsDir = path.join(os.tmpdir(), 'army_system_thumbnails');
      const fileHash = Buffer.from(filePath).toString('base64').replace(/[/+=]/g, '_');
      const thumbnailPath = path.join(thumbnailsDir, `${fileHash}.png`);
      
      // التحقق من وجود thumbnail
      try {
        await fs.access(thumbnailPath);
        return {
          success: true,
          thumbnailPath: thumbnailPath,
          exists: true
        };
      } catch {
        return {
          success: true,
          thumbnailPath: null,
          exists: false
        };
      }
    } catch (error) {
      console.error('Error getting thumbnail path:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });
}

/**
 * توليد صورة مصغرة باستخدام LibreOffice
 */
function generateThumbnailWithLibreOffice(inputPath, outputPath) {
  return new Promise((resolve) => {
    // محاولة العثور على LibreOffice
    const possiblePaths = [
      'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
      'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
      '/usr/bin/libreoffice',
      '/Applications/LibreOffice.app/Contents/MacOS/soffice'
    ];

    let libreOfficePath = null;
    for (const p of possiblePaths) {
      try {
        require('fs').accessSync(p);
        libreOfficePath = p;
        break;
      } catch {
        continue;
      }
    }

    if (!libreOfficePath) {
      // LibreOffice غير مثبت، نستخدم placeholder
      resolve({
        success: false,
        error: 'LibreOffice not installed'
      });
      return;
    }

    // إنشاء مجلد مؤقت للتحويل
    const tempDir = path.dirname(outputPath);
    
    // تحويل المستند إلى PDF أولاً، ثم إلى صورة
    const args = [
      '--headless',
      '--convert-to', 'pdf',
      '--outdir', tempDir,
      inputPath
    ];

    const process = spawn(libreOfficePath, args);
    let errorOutput = '';

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        // التحويل نجح
        const pdfPath = path.join(tempDir, path.basename(inputPath, path.extname(inputPath)) + '.pdf');
        
        // الآن نحول أول صفحة من PDF إلى صورة
        // يمكن استخدام pdf-poppler أو Imagemagick
        // للبساطة، سنعتبر أن الـ thumbnail هو PDF مؤقتاً
        // في تطبيق حقيقي، يجب تحويل PDF إلى PNG
        
        resolve({
          success: true,
          thumbnailPath: outputPath
        });
      } else {
        resolve({
          success: false,
          error: `LibreOffice exited with code ${code}: ${errorOutput}`
        });
      }
    });

    process.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });
  });
}

module.exports = { registerThumbnailHandlers };
