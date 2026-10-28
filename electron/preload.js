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
  selectFile: (filters) => ipcRenderer.invoke('file:select', filters),
  selectFolder: () => ipcRenderer.invoke('file:selectFolder'),
  selectMultipleFiles: (filters) => ipcRenderer.invoke('file:selectMultiple', filters),
  openFile: (filePath) => ipcRenderer.invoke('file:open', filePath),
  openFolder: (folderPath) => ipcRenderer.invoke('file:openFolder', folderPath),
  
  // Document operations
  copyFileToAssets: (sourcePath, destFolder, fileName) => 
    ipcRenderer.invoke('document:copyToAssets', sourcePath, destFolder, fileName),
  deleteFile: (filePath) => ipcRenderer.invoke('document:delete', filePath),
  createDocumentCopy: (documentInfo) => ipcRenderer.invoke('document:createCopy', documentInfo),
  
  // Thumbnail operations
  generateThumbnail: (filePath) => ipcRenderer.invoke('thumbnail:generate', filePath),
  cleanupThumbnails: () => ipcRenderer.invoke('thumbnail:cleanup'),
  
  // Print operations
  printFile: (filePath) => ipcRenderer.invoke('print:file', filePath),
  printMultipleFiles: (filePaths) => ipcRenderer.invoke('print:multiple', filePaths),
  mergeWordFiles: (filePaths, outputPath) => 
    ipcRenderer.invoke('print:mergeWord', filePaths, outputPath),
  
  // Settings operations
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  
  // Data operations
  loadData: () => ipcRenderer.invoke('data:load'),
  saveData: (data) => ipcRenderer.invoke('data:save', data),
  
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
