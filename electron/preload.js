const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // File operations
  selectFile: (filters) => ipcRenderer.invoke('select-file', filters),
  selectFolder: (title) => ipcRenderer.invoke('select-folder', title),
  selectMultipleFiles: (filters) => ipcRenderer.invoke('select-multiple-files', filters),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  copyFile: (source, destination) => ipcRenderer.invoke('copy-file', source, destination),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
  fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
  
  // Document operations
  copyFileToAssets: (sourcePath, destFolder, fileName) => 
    ipcRenderer.invoke('document:copyToAssets', sourcePath, destFolder, fileName),
  deleteDocument: (filePath) => ipcRenderer.invoke('document:delete', filePath),
  createDocumentCopy: (documentInfo) => ipcRenderer.invoke('document:createCopy', documentInfo),
  deleteDocumentCopy: (copyPath) => ipcRenderer.invoke('document:deleteCopy', copyPath),
  openCopiesFolder: (folderInfo) => ipcRenderer.invoke('document:openCopiesFolder', folderInfo),
  getTodayFiles: (dateStr, savePath) => ipcRenderer.invoke('document:getTodayFiles', dateStr, savePath),
  openTodayFolder: (dateStr, savePath) => ipcRenderer.invoke('document:openTodayFolder', dateStr, savePath),
  getCopiesCount: (folderInfo) => ipcRenderer.invoke('document:getCopiesCount', folderInfo),
  
  // Thumbnail operations
  generateThumbnail: (filePath) => ipcRenderer.invoke('thumbnail:generate', filePath),
  cleanupThumbnails: () => ipcRenderer.invoke('thumbnail:cleanup'),
  getThumbnailPath: (filePath) => ipcRenderer.invoke('thumbnail:getPath', filePath),
  
  // Print operations
  printFile: (filePath) => ipcRenderer.invoke('print:file', filePath),
  printMultipleFiles: (filePaths) => ipcRenderer.invoke('print:multiple', filePaths),
  mergeWordFiles: (filePaths, outputPath) => ipcRenderer.invoke('print:mergeWord', filePaths, outputPath),
  mergeAndPrint: (filePaths) => ipcRenderer.invoke('print:mergeAndPrint', filePaths),
  printDirect: (filePath, printerName) => ipcRenderer.invoke('print:direct', filePath, printerName),
  
  // Data operations
  loadData: () => ipcRenderer.invoke('data:load'),
  saveData: (data) => ipcRenderer.invoke('data:save', data),
  backupData: () => ipcRenderer.invoke('data:backup'),
  restoreData: (backupPath) => ipcRenderer.invoke('data:restore', backupPath),
  getDataPath: () => ipcRenderer.invoke('data:getPath'),
  clearData: () => ipcRenderer.invoke('data:clear'),
  
  // Settings operations
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),
  getSettingsPath: () => ipcRenderer.invoke('settings:getPath'),
  
  // Platform info
  platform: process.platform,
  
  // Listen to events from main process
  on: (channel, callback) => {
    const validChannels = ['window:maximized', 'window:unmaximized'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  
  // Remove listeners
  removeListener: (channel, callback) => {
    const validChannels = ['window:maximized', 'window:unmaximized'];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback);
    }
  }
});
