const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    frame: false, // Custom title bar
    backgroundColor: '#1a1a2e',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  const isDev = !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Register custom protocols
function registerCustomProtocols() {
  // asset:// protocol for local files
  protocol.registerFileProtocol('asset', (request, callback) => {
    const filePath = request.url.replace('asset://', '');
    try {
      return callback(decodeURIComponent(filePath));
    } catch (error) {
      console.error('ERROR: registerFileProtocol: asset://', error);
      return callback(404);
    }
  });

  // emoji:// protocol for emoji images
  protocol.registerFileProtocol('emoji', (request, callback) => {
    const fileName = request.url.replace('emoji://', '');
    const filePath = path.join(__dirname, '../public/emoji-images', fileName);
    try {
      return callback(decodeURIComponent(filePath));
    } catch (error) {
      console.error('ERROR: registerFileProtocol: emoji://', error);
      return callback(404);
    }
  });
}

// Import IPC handlers
const { registerWindowHandlers } = require('./ipc/window-handlers');
const { registerFileHandlers } = require('./ipc/file-handlers');
const { registerDocumentHandlers } = require('./ipc/document-handlers');
const { registerThumbnailHandlers } = require('./ipc/thumbnail-handlers');
const { registerPrintHandlers } = require('./ipc/print-handlers');
const { registerDataHandlers } = require('./ipc/data-handlers');
const { registerSettingsHandlers } = require('./ipc/settings-handlers');

// App ready
app.whenReady().then(() => {
  registerCustomProtocols();
  
  // Register all IPC handlers first
  // These handlers don't need mainWindow reference in their registration
  // but will be called with mainWindow when needed
  registerFileHandlers();
  registerDocumentHandlers();
  registerThumbnailHandlers();
  registerPrintHandlers();
  registerDataHandlers();
  registerSettingsHandlers();
  
  // Create window after registering handlers
  createWindow();
  
  // Register window handlers that need mainWindow
  registerWindowHandlers(mainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
