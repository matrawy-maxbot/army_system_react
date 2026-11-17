/**
 * Settings API Wrapper
 * 
 * Automatically switches between:
 * - HTTP API (when running in browser dev mode)
 * - Electron IPC (when running as Electron app)
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Check if running in Electron environment
 */
function isElectron() {
  return !!(window.electron?.ipcRenderer);
}

/**
 * HTTP API for Browser Dev Mode
 */
const httpSettingsAPI = {
  async initialize() {
    // Check if server is running
    try {
      const response = await fetch('http://localhost:3001/health');
      if (!response.ok) throw new Error('Server not responding');
      console.log('✅ Dev server connected');
      return { success: true };
    } catch (error) {
      console.error('❌ Dev server not running. Start it with: npm run server');
      return { success: false, error: 'Dev server not running' };
    }
  },

  async getAll() {
    const response = await fetch(`${API_BASE_URL}/settings`);
    return await response.json();
  },

  async get(key) {
    const response = await fetch(`${API_BASE_URL}/settings/${key}`);
    return await response.json();
  },

  async updateMultiple(settings) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await response.json();
  },

  async update(key, value) {
    const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    });
    return await response.json();
  },

  async getFormattedPath(filename, dateString = null) {
    const response = await fetch(`${API_BASE_URL}/settings/formatted-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, date: dateString })
    });
    return await response.json();
  },

  async ensureDirectory(directory) {
    const response = await fetch(`${API_BASE_URL}/settings/ensure-directory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ directory })
    });
    return await response.json();
  },

  async validatePath(path) {
    const response = await fetch(`${API_BASE_URL}/settings/validate-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    return await response.json();
  },

  // Helper methods
  async getSavePath() {
    const result = await this.get('save_path');
    return result.success ? result.data : null;
  },

  async updateSavePath(path) {
    return await this.update('save_path', path);
  },

  async getFolderPattern() {
    const result = await this.get('folder_pattern');
    return result.success ? result.data : 'YYYY-MM-DD';
  },

  async updateFolderPattern(pattern) {
    return await this.update('folder_pattern', pattern);
  },

  async getTheme() {
    const result = await this.get('theme');
    return result.success ? result.data : 'light';
  },

  async updateTheme(theme) {
    return await this.update('theme', theme);
  }
};

/**
 * Real Electron API (IPC)
 */
const electronSettingsAPI = {
  async initialize() {
    return await window.electron.ipcRenderer.invoke('settings:initialize');
  },

  async getAll() {
    return await window.electron.ipcRenderer.invoke('settings:getAll');
  },

  async get(key) {
    return await window.electron.ipcRenderer.invoke('settings:get', key);
  },

  async updateMultiple(settings) {
    return await window.electron.ipcRenderer.invoke('settings:updateMultiple', settings);
  },

  async update(key, value) {
    return await window.electron.ipcRenderer.invoke('settings:update', key, value);
  },

  async getFormattedPath(filename, dateString = null) {
    return await window.electron.ipcRenderer.invoke('settings:getFormattedPath', filename, dateString);
  },

  async ensureDirectory(directory) {
    return await window.electron.ipcRenderer.invoke('settings:ensureDirectory', directory);
  },

  async validatePath(path) {
    return await window.electron.ipcRenderer.invoke('settings:validatePath', path);
  },

  // Helper methods
  async getSavePath() {
    const result = await this.get('save_path');
    return result.success ? result.data : null;
  },

  async updateSavePath(path) {
    return await this.update('save_path', path);
  },

  async getFolderPattern() {
    const result = await this.get('folder_pattern');
    return result.success ? result.data : 'YYYY-MM-DD';
  },

  async updateFolderPattern(pattern) {
    return await this.update('folder_pattern', pattern);
  },

  async getTheme() {
    const result = await this.get('theme');
    return result.success ? result.data : 'light';
  },

  async updateTheme(theme) {
    return await this.update('theme', theme);
  }
};

/**
 * Auto-selecting API
 * Uses Electron IPC if available, otherwise falls back to HTTP API
 */
const settingsAPI = {
  _getAPI() {
    if (isElectron()) {
      console.log('🔌 Using Electron IPC API');
      return electronSettingsAPI;
    } else {
      console.log('🌐 Using HTTP API (Dev Server)');
      return httpSettingsAPI;
    }
  },

  async initialize() {
    return await this._getAPI().initialize();
  },

  async getAll() {
    return await this._getAPI().getAll();
  },

  async get(key) {
    return await this._getAPI().get(key);
  },

  async updateMultiple(settings) {
    return await this._getAPI().updateMultiple(settings);
  },

  async update(key, value) {
    return await this._getAPI().update(key, value);
  },

  async getFormattedPath(filename, dateString = null) {
    return await this._getAPI().getFormattedPath(filename, dateString);
  },

  async ensureDirectory(directory) {
    return await this._getAPI().ensureDirectory(directory);
  },

  async validatePath(path) {
    return await this._getAPI().validatePath(path);
  },

  // Helper methods
  async getSavePath() {
    return await this._getAPI().getSavePath();
  },

  async updateSavePath(path) {
    return await this._getAPI().updateSavePath(path);
  },

  async getFolderPattern() {
    return await this._getAPI().getFolderPattern();
  },

  async updateFolderPattern(pattern) {
    return await this._getAPI().updateFolderPattern(pattern);
  },

  async getTheme() {
    return await this._getAPI().getTheme();
  },

  async updateTheme(theme) {
    return await this._getAPI().updateTheme(theme);
  },

  // Utility: Check current mode
  isElectronMode() {
    return isElectron();
  },

  getCurrentMode() {
    return isElectron() ? 'electron' : 'http';
  }
};

export default settingsAPI;
