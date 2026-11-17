/**
 * Development Server for Browser Mode
 * 
 * This Express server runs during development (npm run dev)
 * Provides the same API endpoints that Electron IPC provides
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import fs from 'fs';
import os from 'os';
import SettingsRepository from '../src/shared/repositories/settingsRepository.js';
import SettingsController from '../src/shared/controllers/settingsController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main async function
async function startServer() {
  const app = express();
  const PORT = 3001;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Database setup
  const userDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'army-system-electron');
  const dbDirectory = path.join(userDataPath, 'database');
  const dbPath = path.join(dbDirectory, 'application.db');

  console.log('📁 Database path:', dbPath);

  // Create directory
  fs.mkdirSync(dbDirectory, { recursive: true });

  // Initialize database
  const db = new Database(dbPath, {
    timeout: 5000,
    fileMustExist: false,
  });

  // Configure database
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('temp_store = MEMORY');
  db.pragma('cache_size = -8000');

  console.log('✅ Database initialized');

  // Create tables
  console.log('🔄 Creating tables...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  console.log('✅ Tables created');

  // Initialize Repository and Controller
  const settingsRepository = new SettingsRepository(db);
  const settingsController = new SettingsController(
    settingsRepository,
    null // No Electron app in dev mode
  );

  // Initialize default settings (async - wait for it!)
  const documentsPath = path.join(os.homedir(), 'Documents');
  await settingsController.initializeDefaults(documentsPath);

  console.log('✅ Default settings initialized');

  // ==================== Settings API Routes ====================

  /**
   * GET /api/settings - Get all settings
   */
  app.get('/api/settings', async (req, res) => {
    const result = await settingsController.getSettings();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  });

  /**
   * GET /api/settings/:key - Get single setting
   */
  app.get('/api/settings/:key', async (req, res) => {
    const { key } = req.params;
    const result = await settingsController.getSetting(key);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  });

  /**
   * POST /api/settings - Update multiple settings
   */
  app.post('/api/settings', async (req, res) => {
    const settings = req.body;
    const result = await settingsController.updateSettings(settings);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  });

  /**
   * PUT /api/settings/:key - Update single setting
   */
  app.put('/api/settings/:key', async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    const result = await settingsController.updateSetting(key, value);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  });

  /**
   * POST /api/settings/formatted-path - Get formatted path
   */
  app.post('/api/settings/formatted-path', async (req, res) => {
    const { filename, date: dateString } = req.body;
    const date = dateString ? new Date(dateString) : new Date();
    
    const result = await settingsController.getFormattedPath(filename, date);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  });

  /**
   * POST /api/settings/validate-path - Validate path
   */
  app.post('/api/settings/validate-path', async (req, res) => {
    const { path: dirPath } = req.body;
    const result = await settingsController.validatePath(dirPath);
    
    res.json(result);
  });

  /**
   * POST /api/settings/ensure-directory - Ensure directory exists
   */
  app.post('/api/settings/ensure-directory', async (req, res) => {
    const { directory } = req.body;
    const result = await settingsController.ensureDirectory(directory);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  });

  // ==================== Health Check ====================

  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      database: 'connected',
      path: dbPath,
      size: `${(fs.statSync(dbPath).size / 1024).toFixed(2)} KB`
    });
  });

  // ==================== Start Server ====================

  const server = app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(60));
    console.log('🚀 Development Server Started!');
    console.log('='.repeat(60));
    console.log(`📡 API Server: http://localhost:${PORT}`);
    console.log(`💾 Database: ${dbPath}`);
    console.log(`📊 Database Size: ${(fs.statSync(dbPath).size / 1024).toFixed(2)} KB`);
    console.log('');
    console.log('📋 Available Endpoints:');
    console.log('   GET    /health');
    console.log('   GET    /api/settings');
    console.log('   GET    /api/settings/:key');
    console.log('   POST   /api/settings');
    console.log('   PUT    /api/settings/:key');
    console.log('   POST   /api/settings/formatted-path');
    console.log('   POST   /api/settings/validate-path');
    console.log('   POST   /api/settings/ensure-directory');
    console.log('='.repeat(60));
    console.log('');
    console.log('💡 Press Ctrl+C to stop the server');
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🔚 Closing database...');
    db.close();
    console.log('✅ Database closed. Goodbye!');
    server.close(() => {
      console.log('✅ Server closed. Goodbye!');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    console.log('\n\n🔚 Received SIGTERM, closing...');
    db.close();
    server.close(() => {
      process.exit(0);
    });
  });
}

// Start the server
startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
