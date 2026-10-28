const { ipcMain, BrowserWindow } = require('electron');

/**
 * Window Handlers - معالجات النافذة
 * التحكم بالنافذة: تصغير، تكبير، إغلاق
 */

function registerWindowHandlers(mainWindow) {
  
  // تصغير النافذة
  ipcMain.handle('window:minimize', () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
    return { success: true };
  });

  // تكبير/استعادة النافذة
  ipcMain.handle('window:maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
    return { success: true };
  });

  // إغلاق النافذة
  ipcMain.handle('window:close', () => {
    if (mainWindow) {
      mainWindow.close();
    }
    return { success: true };
  });

  // التحقق من حالة التكبير
  ipcMain.handle('window:isMaximized', () => {
    return { success: true, isMaximized: mainWindow ? mainWindow.isMaximized() : false };
  });

  // إرسال أحداث تغيير حالة النافذة
  if (mainWindow) {
    mainWindow.on('maximize', () => {
      mainWindow.webContents.send('window:maximized');
    });

    mainWindow.on('unmaximize', () => {
      mainWindow.webContents.send('window:unmaximized');
    });
  }
}

module.exports = { registerWindowHandlers };
