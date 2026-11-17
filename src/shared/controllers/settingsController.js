/**
 * Settings Controller
 * 
 * Unified business logic for settings management.
 * Works with any SettingsRepository instance.
 * 
 * Used by:
 * - Express routes (dev mode)
 * - Electron IPC handlers (production)
 */

import path from 'node:path';
import fs from 'node:fs';

class SettingsController {
  constructor(repository, appGetPath = null) {
    this.repository = repository;
    this.appGetPath = appGetPath; // Electron app.getPath or null for dev mode
  }

  // Default settings keys
  static KEYS = {
    SAVE_PATH: 'save_path',
    FOLDER_PATTERN: 'folder_pattern',
    AUTO_BACKUP: 'auto_backup',
    BACKUP_INTERVAL: 'backup_interval',
    THEME: 'theme',
    LANGUAGE: 'language',
    FONT_SIZE: 'font_size',
    NOTIFICATIONS_ENABLED: 'notifications_enabled',
  };

  /**
   * Get default values
   */
  getDefaults(documentsPath) {
    return {
      [SettingsController.KEYS.SAVE_PATH]: path.join(documentsPath, 'ArmySystem'),
      [SettingsController.KEYS.FOLDER_PATTERN]: 'YYYY-MM-DD',
      [SettingsController.KEYS.AUTO_BACKUP]: '1',
      [SettingsController.KEYS.BACKUP_INTERVAL]: 'daily',
      [SettingsController.KEYS.THEME]: 'light',
      [SettingsController.KEYS.LANGUAGE]: 'ar',
      [SettingsController.KEYS.FONT_SIZE]: 'medium',
      [SettingsController.KEYS.NOTIFICATIONS_ENABLED]: '1',
    };
  }

  /**
   * Initialize default settings
   */
  async initializeDefaults(documentsPath) {
    try {
      const defaults = this.getDefaults(documentsPath);
      this.repository.initializeDefaults(defaults);
      
      // Ensure save path directory exists
      const savePath = defaults[SettingsController.KEYS.SAVE_PATH];
      if (savePath) {
        await fs.promises.mkdir(savePath, { recursive: true });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to initialize default settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all settings
   */
  async getSettings() {
    try {
      const rows = this.repository.getAll();
      
      // Convert array to object and parse values
      const settings = rows.reduce((acc, row) => {
        acc[row.key] = this.parseValue(row.key, row.value);
        return acc;
      }, {});
      
      return { success: true, data: settings };
    } catch (error) {
      console.error('Failed to get settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a single setting by key
   */
  async getSetting(key) {
    try {
      const setting = this.repository.getByKey(key);
      
      if (!setting) {
        return { success: true, data: null };
      }
      
      return { success: true, data: this.parseValue(key, setting.value) };
    } catch (error) {
      console.error(`Failed to get setting '${key}':`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update multiple settings
   */
  async updateSettings(settings) {
    try {
      // Validate settings
      const validation = this.validateSettings(settings);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      
      // Handle save_path changes (ensure directory exists)
      if (settings[SettingsController.KEYS.SAVE_PATH]) {
        const newPath = settings[SettingsController.KEYS.SAVE_PATH];
        await fs.promises.mkdir(newPath, { recursive: true });
      }
      
      // Convert boolean values to strings
      const convertedSettings = {};
      for (const [key, value] of Object.entries(settings)) {
        convertedSettings[key] = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
      }
      
      // Update in database
      this.repository.setMultiple(convertedSettings);
      
      // Return updated settings
      return await this.getSettings();
    } catch (error) {
      console.error('Failed to update settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update a single setting
   */
  async updateSetting(key, value) {
    try {
      const validation = this.validateSetting(key, value);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      
      // Handle save_path changes
      if (key === SettingsController.KEYS.SAVE_PATH) {
        await fs.promises.mkdir(value, { recursive: true });
      }
      
      // Convert boolean to string
      const stringValue = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
      
      const updated = this.repository.set(key, stringValue);
      
      return { 
        success: true, 
        data: { 
          key: updated.key, 
          value: this.parseValue(updated.key, updated.value) 
        } 
      };
    } catch (error) {
      console.error(`Failed to update setting '${key}':`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get formatted file path based on current settings
   */
  async getFormattedPath(filename, date = new Date()) {
    try {
      const savePathSetting = this.repository.getByKey(SettingsController.KEYS.SAVE_PATH);
      const folderPatternSetting = this.repository.getByKey(SettingsController.KEYS.FOLDER_PATTERN);
      
      const savePath = savePathSetting?.value;
      const folderPattern = folderPatternSetting?.value || 'YYYY-MM-DD';
      
      if (!savePath) {
        throw new Error('Save path not configured');
      }
      
      // Format date folder based on pattern
      const dateFolder = this.formatDatePattern(date, folderPattern);
      
      // Build full path
      const directory = path.join(savePath, dateFolder);
      const fullPath = path.join(directory, filename);
      
      return {
        success: true,
        data: {
          fullPath,
          directory,
          filename,
          relativePath: path.join(dateFolder, filename),
        },
      };
    } catch (error) {
      console.error('Failed to get formatted path:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Ensure directory exists
   */
  async ensureDirectory(directory) {
    try {
      await fs.promises.mkdir(directory, { recursive: true });
      return { success: true, data: { directory } };
    } catch (error) {
      console.error('Failed to ensure directory:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate directory path
   */
  async validatePath(directoryPath) {
    try {
      // Check if path is absolute
      if (!path.isAbsolute(directoryPath)) {
        return { 
          success: false, 
          valid: false, 
          error: 'Path must be absolute' 
        };
      }
      
      // Try to create directory
      await fs.promises.mkdir(directoryPath, { recursive: true });
      
      // Check if writable
      await fs.promises.access(directoryPath, fs.constants.W_OK);
      
      return { success: true, valid: true };
    } catch (error) {
      return { 
        success: false, 
        valid: false, 
        error: `Invalid path: ${error.message}` 
      };
    }
  }

  /**
   * Format date based on pattern
   */
  formatDatePattern(date, pattern) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return pattern
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }

  /**
   * Parse setting value based on key
   */
  parseValue(key, value) {
    if (value === null || value === undefined) {
      return null;
    }
    
    // Boolean settings
    if ([
      SettingsController.KEYS.AUTO_BACKUP,
      SettingsController.KEYS.NOTIFICATIONS_ENABLED,
    ].includes(key)) {
      return value === '1' || value === 'true';
    }
    
    return value;
  }

  /**
   * Validate settings object
   */
  validateSettings(settings) {
    for (const [key, value] of Object.entries(settings)) {
      const validation = this.validateSetting(key, value);
      if (!validation.valid) {
        return validation;
      }
    }
    
    return { valid: true };
  }

  /**
   * Validate a single setting
   */
  validateSetting(key, value) {
    // Validate folder pattern
    if (key === SettingsController.KEYS.FOLDER_PATTERN) {
      const validPatterns = ['YYYY-MM-DD', 'YYYY-MM', 'YYYY', 'YYYY/MM/DD', 'YYYY/MM'];
      if (!validPatterns.includes(value)) {
        return {
          valid: false,
          error: `Invalid folder pattern. Must be one of: ${validPatterns.join(', ')}`,
        };
      }
    }
    
    // Validate backup interval
    if (key === SettingsController.KEYS.BACKUP_INTERVAL) {
      const validIntervals = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validIntervals.includes(value)) {
        return {
          valid: false,
          error: `Invalid backup interval. Must be one of: ${validIntervals.join(', ')}`,
        };
      }
    }
    
    // Validate theme
    if (key === SettingsController.KEYS.THEME) {
      const validThemes = ['light', 'dark', 'auto'];
      if (!validThemes.includes(value)) {
        return {
          valid: false,
          error: `Invalid theme. Must be one of: ${validThemes.join(', ')}`,
        };
      }
    }
    
    // Validate language
    if (key === SettingsController.KEYS.LANGUAGE) {
      const validLanguages = ['ar', 'en'];
      if (!validLanguages.includes(value)) {
        return {
          valid: false,
          error: `Invalid language. Must be one of: ${validLanguages.join(', ')}`,
        };
      }
    }
    
    return { valid: true };
  }
}

export default SettingsController;
