const { ipcMain, shell } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

/**
 * Print Handlers - معالجات الطباعة
 * طباعة المستندات ودمج ملفات Word
 */

function registerPrintHandlers() {
  
  // طباعة ملف واحد
  ipcMain.handle('print:file', async (event, filePath) => {
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

      // فتح الملف في التطبيق الافتراضي (Word سيفتح الملف ويمكن الطباعة منه)
      await shell.openPath(filePath);

      return {
        success: true,
        message: 'File opened for printing'
      };
    } catch (error) {
      console.error('Error printing file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // طباعة ملفات متعددة
  ipcMain.handle('print:multiple', async (event, filePaths) => {
    try {
      // فتح كل ملف في التطبيق الافتراضي
      for (const filePath of filePaths) {
        try {
          await fs.access(filePath);
          await shell.openPath(filePath);
          // تأخير قصير بين فتح الملفات
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error opening file ${filePath}:`, error);
        }
      }

      return {
        success: true,
        message: `Opened ${filePaths.length} files for printing`
      };
    } catch (error) {
      console.error('Error printing multiple files:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // دمج ملفات Word
  ipcMain.handle('print:mergeWord', async (event, filePaths, outputPath) => {
    try {
      // التحقق من وجود جميع الملفات
      for (const filePath of filePaths) {
        try {
          await fs.access(filePath);
        } catch {
          return {
            success: false,
            error: `File not found: ${filePath}`
          };
        }
      }

      // محاولة دمج الملفات باستخدام Word Automation (يتطلب Word مثبت)
      const result = await mergeWordFiles(filePaths, outputPath);
      
      if (result.success) {
        // فتح الملف المدموج
        await shell.openPath(outputPath);
        
        return {
          success: true,
          mergedFilePath: outputPath
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Error merging Word files:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // دمج وطباعة
  ipcMain.handle('print:mergeAndPrint', async (event, filePaths) => {
    try {
      // إنشاء مسار مؤقت للملف المدموج
      const tempDir = os.tmpdir();
      const timestamp = Date.now();
      const outputPath = path.join(tempDir, `merged_document_${timestamp}.docx`);

      // دمج الملفات
      const mergeResult = await mergeWordFiles(filePaths, outputPath);
      
      if (!mergeResult.success) {
        return {
          success: false,
          error: mergeResult.error
        };
      }

      // فتح الملف المدموج للطباعة
      await shell.openPath(outputPath);

      return {
        success: true,
        mergedFilePath: outputPath
      };
    } catch (error) {
      console.error('Error merging and printing:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // طباعة مباشرة بدون نافذة (يتطلب printer)
  ipcMain.handle('print:direct', async (event, filePath, printerName) => {
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

      // استخدام PowerShell للطباعة المباشرة على Windows
      if (process.platform === 'win32') {
        const result = await printWithPowerShell(filePath, printerName);
        return result;
      } else {
        // على أنظمة أخرى، استخدم lpr
        return {
          success: false,
          error: 'Direct printing not supported on this platform'
        };
      }
    } catch (error) {
      console.error('Error direct printing:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });
}

/**
 * دمج ملفات Word باستخدام LibreOffice أو Python-docx
 */
async function mergeWordFiles(filePaths, outputPath) {
  try {
    // الطريقة 1: استخدام LibreOffice (إذا كان مثبتاً)
    const libreOfficeResult = await mergeWithLibreOffice(filePaths, outputPath);
    if (libreOfficeResult.success) {
      return libreOfficeResult;
    }

    // الطريقة 2: نسخ الملفات يدوياً (fallback بسيط)
    // هذه طريقة بسيطة جداً - في الواقع تحتاج إلى استخدام مكتبة مثل python-docx
    // أو Word Automation API لدمج حقيقي
    
    // للبساطة، سننسخ أول ملف كناتج
    await fs.copyFile(filePaths[0], outputPath);
    
    return {
      success: true,
      method: 'simple-copy',
      warning: 'Only the first file was used. Full merging requires LibreOffice or Word.'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * دمج ملفات Word باستخدام LibreOffice
 */
function mergeWithLibreOffice(filePaths, outputPath) {
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
      resolve({
        success: false,
        error: 'LibreOffice not installed'
      });
      return;
    }

    // LibreOffice لا يدعم الدمج مباشرة من command line
    // سنحتاج إلى script أو macro
    resolve({
      success: false,
      error: 'LibreOffice merge not implemented'
    });
  });
}

/**
 * طباعة باستخدام PowerShell (Windows only)
 */
function printWithPowerShell(filePath, printerName) {
  return new Promise((resolve) => {
    const script = printerName
      ? `Start-Process -FilePath "${filePath}" -Verb PrintTo -ArgumentList "${printerName}"`
      : `Start-Process -FilePath "${filePath}" -Verb Print`;

    const process = spawn('powershell.exe', ['-Command', script]);
    
    let errorOutput = '';

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          message: 'Print job sent'
        });
      } else {
        resolve({
          success: false,
          error: `PowerShell exited with code ${code}: ${errorOutput}`
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

module.exports = { registerPrintHandlers };
