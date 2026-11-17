/**
 * Settings Repository
 * 
 * Unified database operations for settings table.
 * Works with any better-sqlite3 database instance.
 * 
 * Used by:
 * - Express server (dev mode)
 * - Electron main process (production)
 */

class SettingsRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get a single setting by key
   */
  getByKey(key) {
    try {
      const stmt = this.db.prepare(`
        SELECT id, key, value, updated_at
        FROM settings
        WHERE key = ?
      `);
      
      return stmt.get(key) || null;
    } catch (error) {
      throw new Error(`Failed to get setting '${key}': ${error.message}`);
    }
  }

  /**
   * Get all settings
   */
  getAll() {
    try {
      const stmt = this.db.prepare(`
        SELECT id, key, value, updated_at
        FROM settings
        ORDER BY key ASC
      `);
      
      return stmt.all();
    } catch (error) {
      throw new Error(`Failed to get all settings: ${error.message}`);
    }
  }

  /**
   * Set or update a single setting
   */
  set(key, value) {
    try {
      const stringValue = value !== null && value !== undefined ? String(value) : null;
      
      const stmt = this.db.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = datetime('now')
      `);
      
      stmt.run(key, stringValue);
      
      return this.getByKey(key);
    } catch (error) {
      throw new Error(`Failed to set setting '${key}': ${error.message}`);
    }
  }

  /**
   * Set or update multiple settings in a transaction
   */
  setMultiple(settings) {
    try {
      const transaction = this.db.transaction((settingsObj) => {
        const stmt = this.db.prepare(`
          INSERT INTO settings (key, value, updated_at)
          VALUES (?, ?, datetime('now'))
          ON CONFLICT(key) DO UPDATE SET
            value = excluded.value,
            updated_at = datetime('now')
        `);
        
        let count = 0;
        for (const [key, value] of Object.entries(settingsObj)) {
          const stringValue = value !== null && value !== undefined ? String(value) : null;
          stmt.run(key, stringValue);
          count++;
        }
        
        return count;
      });
      
      return transaction(settings);
    } catch (error) {
      throw new Error(`Failed to set multiple settings: ${error.message}`);
    }
  }

  /**
   * Delete a setting by key
   */
  delete(key) {
    try {
      const stmt = this.db.prepare(`
        DELETE FROM settings WHERE key = ?
      `);
      
      const result = stmt.run(key);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Failed to delete setting '${key}': ${error.message}`);
    }
  }

  /**
   * Check if a setting exists
   */
  exists(key) {
    try {
      const stmt = this.db.prepare(`
        SELECT 1 FROM settings WHERE key = ? LIMIT 1
      `);
      
      return stmt.get(key) !== undefined;
    } catch (error) {
      throw new Error(`Failed to check setting existence '${key}': ${error.message}`);
    }
  }

  /**
   * Initialize default settings if they don't exist
   */
  initializeDefaults(defaults) {
    try {
      const transaction = this.db.transaction((defaultSettings) => {
        const stmt = this.db.prepare(`
          INSERT OR IGNORE INTO settings (key, value, updated_at)
          VALUES (?, ?, datetime('now'))
        `);
        
        for (const [key, value] of Object.entries(defaultSettings)) {
          const stringValue = value !== null && value !== undefined ? String(value) : null;
          stmt.run(key, stringValue);
        }
      });
      
      transaction(defaults);
    } catch (error) {
      throw new Error(`Failed to initialize default settings: ${error.message}`);
    }
  }
}

export default SettingsRepository;
