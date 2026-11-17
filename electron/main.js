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
    mainWindow.loadFile(path.join(__dirname, '../dist-vite/index.html'));
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

// Import IPC handlers (Old system - Keep for backward compatibility)
const { registerWindowHandlers } = require('./ipc/window-handlers');
const { registerFileHandlers } = require('./ipc/file-handlers');
const { registerDocumentHandlers } = require('./ipc/document-handlers');
const { registerThumbnailHandlers } = require('./ipc/thumbnail-handlers');
const { registerPrintHandlers } = require('./ipc/print-handlers');
const { registerDataHandlers } = require('./ipc/data-handlers');
const { registerSettingsHandlers: registerOldSettingsHandlers } = require('./ipc/settings-handlers');

// Import database
const { initializeDatabase, closeDatabase } = require('./ipc/database-init');

// Import new MVC-based API system
let database, settingsController, registerAllHandlers;

// Try to import ES6 modules (new system)
async function loadNewAPISystem() {
  try {
    // Dynamic import for ES6 modules
    const dbModule = await import(path.join(__dirname, '../src/main/database/connection/database.js'));
    const tablesModule = await import(path.join(__dirname, '../src/main/database/tables/index.js'));
    const ipcModule = await import(path.join(__dirname, '../src/main/ipc/index.js'));
    const settingsCtrlModule = await import(path.join(__dirname, '../src/main/controllers/settingsController.js'));
    
    database = dbModule.default;
    settingsController = settingsCtrlModule.default;
    registerAllHandlers = ipcModule.registerAllHandlers;
    
    // Initialize new database system
    console.log('🔄 Initializing new MVC database system...');
    database.initialize();
    tablesModule.initializeTables();
    
    // Initialize default settings
    console.log('🔄 Initializing default settings...');
    await settingsController.initializeDefaults();
    
    // Register new IPC handlers
    console.log('🔄 Registering new MVC-based IPC handlers...');
    registerAllHandlers();
    
    console.log('✅ New MVC API system loaded successfully!');
    return true;
  } catch (error) {
    console.warn('⚠️ New API system not available yet, using legacy handlers:', error.message);
    return false;
  }
}

// App ready
app.whenReady().then(async () => {
  registerCustomProtocols();
  
  // Try to load new API system first
  const newSystemLoaded = await loadNewAPISystem();
  
  if (!newSystemLoaded) {
    // Fallback to old database system
    const dbResult = initializeDatabase();
    if (dbResult.success) {
      console.log("✅", dbResult.message);
      console.log("📁 Database path:", dbResult.path);
    } else {
      console.error("❌ Database initialization failed:", dbResult.message);
    }
    
    // Register old handlers
    registerOldSettingsHandlers();
  }
  
  // Register all legacy IPC handlers (keep for backward compatibility)
  registerFileHandlers();
  registerDocumentHandlers();
  registerThumbnailHandlers();
  registerPrintHandlers();
  registerDataHandlers();
  
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

// Clean up before quit
app.on('before-quit', () => {
  const result = closeDatabase();
  if (result.success) {
    console.log("✅ Database closed successfully");
  }
});
