/**
 * IPC Handlers Registry
 * 
 * Central registration point for all IPC handlers.
 * Import and register all module handlers here.
 */

import { registerSettingsHandlers, unregisterSettingsHandlers } from "./settingsIpc.js";

/**
 * Register all IPC handlers
 */
export function registerAllHandlers() {
  console.log("📡 Registering IPC handlers...");
  
  // Settings
  registerSettingsHandlers();
  
  // TODO: Add more handlers as we build them
  // registerFaxesHandlers();
  // registerArchiveHandlers();
  // registerRemindersHandlers();
  // etc.
  
  console.log("✅ All IPC handlers registered successfully");
}

/**
 * Unregister all IPC handlers
 * (useful for cleanup or hot reload)
 */
export function unregisterAllHandlers() {
  console.log("📡 Unregistering IPC handlers...");
  
  unregisterSettingsHandlers();
  
  // TODO: Add more unregisters
  
  console.log("✅ All IPC handlers unregistered");
}
