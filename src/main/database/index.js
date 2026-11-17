/**
 * Main Database Module
 * 
 * This module provides centralized access to:
 * - Database connection management
 * - Table creation and initialization
 * - CRUD operations for all entities
 */

/**
 * Main Database Module
 * 
 * This module provides centralized access to:
 * - Database connection management
 * - Table creation and initialization
 */

import database from "./connection/database.js";
import { initializeTables } from "./tables/index.js";

/**
 * Initialize the complete database system.
 * Must be called after Electron app is ready.
 */
export function initializeDatabase() {
  try {
    // Initialize connection
    database.initialize();
    
    // Create all tables
    initializeTables();
    
    return {
      success: true,
      message: "Database initialized successfully",
      path: database.databasePath
    };
  } catch (error) {
    console.error("Database initialization error:", error);
    return {
      success: false,
      message: `Database initialization failed: ${error.message}`,
      error: error
    };
  }
}

/**
 * Close database connection.
 * Should be called before app quit.
 */
export function closeDatabase() {
  try {
    database.close();
    return {
      success: true,
      message: "Database closed successfully"
    };
  } catch (error) {
    console.error("Database closing error:", error);
    return {
      success: false,
      message: `Database closing failed: ${error.message}`,
      error: error
    };
  }
}

/**
 * Get database connection status.
 */
export function getDatabaseStatus() {
  return {
    isConnected: database.isConnected,
    path: database.databasePath
  };
}

// Export database connection (for direct access when needed)
export { database };
