/**
 * Settings IPC Handlers (Electron Production Mode)
 * 
 * Uses the same Controller and Repository as Express routes
 * Provides IPC communication between Renderer and Main process
 */

import { ipcMain, app } from 'electron';
import database from '../database/connection/database.js';
import SettingsRepository from '../../shared/repositories/settingsRepository.js';
import SettingsController from '../../shared/controllers/settingsController.js';

let settingsRepository = null;
let settingsController = null;

/**
 * Initialize repository and controller
 */
function initializeSettingsService() {
  if (!settingsRepository) {
    const db = database.connection;
    settingsRepository = new SettingsRepository(db);
    settingsController = new SettingsController(
      settingsRepository,
      app.getPath.bind(app) // Pass Electron's app.getPath
    );
    
    // Initialize defaults
    const documentsPath = app.getPath('documents');
    settingsController.initializeDefaults(documentsPath);
  }
  
  return settingsController;
}

/**
 * Register all settings-related IPC handlers
 */
export function registerSettingsHandlers() {
  /**
   * Initialize default settings
   */
  ipcMain.handle('settings:initialize', async () => {
    const controller = initializeSettingsService();
    const documentsPath = app.getPath('documents');
    return await controller.initializeDefaults(documentsPath);
  });

  /**
   * Get all settings
   */
  ipcMain.handle('settings:getAll', async () => {
    const controller = initializeSettingsService();
    return await controller.getSettings();
  });

  /**
   * Get a single setting by key
   */
  ipcMain.handle('settings:get', async (event, key) => {
    const controller = initializeSettingsService();
    return await controller.getSetting(key);
  });

  /**
   * Update multiple settings
   */
  ipcMain.handle('settings:updateMultiple', async (event, settings) => {
    const controller = initializeSettingsService();
    return await controller.updateSettings(settings);
  });

  /**
   * Update a single setting
   */
  ipcMain.handle('settings:update', async (event, key, value) => {
    const controller = initializeSettingsService();
    return await controller.updateSetting(key, value);
  });

  /**
   * Get formatted file path
   */
  ipcMain.handle('settings:getFormattedPath', async (event, filename, dateString = null) => {
    const controller = initializeSettingsService();
    const date = dateString ? new Date(dateString) : new Date();
    return await controller.getFormattedPath(filename, date);
  });

  /**
   * Ensure directory exists
   */
  ipcMain.handle('settings:ensureDirectory', async (event, directory) => {
    const controller = initializeSettingsService();
    return await controller.ensureDirectory(directory);
  });

  /**
   * Validate directory path
   */
  ipcMain.handle('settings:validatePath', async (event, directoryPath) => {
    const controller = initializeSettingsService();
    return await controller.validatePath(directoryPath);
  });

  console.log('✅ Settings IPC handlers registered');
}

/**
 * Unregister all settings IPC handlers
 */
export function unregisterSettingsHandlers() {
  ipcMain.removeHandler('settings:initialize');
  ipcMain.removeHandler('settings:getAll');
  ipcMain.removeHandler('settings:get');
  ipcMain.removeHandler('settings:updateMultiple');
  ipcMain.removeHandler('settings:update');
  ipcMain.removeHandler('settings:getFormattedPath');
  ipcMain.removeHandler('settings:ensureDirectory');
  ipcMain.removeHandler('settings:validatePath');
  
  console.log('✅ Settings IPC handlers unregistered');
}
