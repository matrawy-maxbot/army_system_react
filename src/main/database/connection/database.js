import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { app } from "electron";

class DatabaseManager {
  #connection = null;
  #databasePath = null;

  /**
   * Initialize SQLite connection.
   * Reuses the existing connection if already initialized.
   */
  initialize() {
    if (this.#connection?.open) {
      return this.#connection;
    }

    try {
      const databaseDirectory = path.join(
        app.getPath("userData"),
        "database"
      );

      fs.mkdirSync(databaseDirectory, {
        recursive: true,
      });

      this.#databasePath = path.join(
        databaseDirectory,
        "application.db"
      );

      this.#connection = new Database(this.#databasePath, {
        timeout: 5000,
        fileMustExist: false,
      });

      this.#configure();

      return this.#connection;
    } catch (error) {
      this.#closeOnError();

      throw new Error(
        `Database initialization failed: ${error.message}`,
        { cause: error }
      );
    }
  }

  /**
   * Configure SQLite database.
   */
  #configure() {
    const db = this.#connection;

    db.pragma("foreign_keys = ON");
    db.pragma("busy_timeout = 5000");
    db.pragma("journal_mode = WAL");
    db.pragma("synchronous = NORMAL");
    db.pragma("temp_store = MEMORY");
    db.pragma("cache_size = -8000");

    const foreignKeys = db.pragma("foreign_keys", {
      simple: true,
    });

    if (foreignKeys !== 1) {
      throw new Error("Failed to enable foreign keys.");
    }
  }

  /**
   * Get the active database connection.
   */
  get connection() {
    if (!this.#connection?.open) {
      throw new Error(
        "Database is not initialized. Call initialize() first."
      );
    }

    return this.#connection;
  }

  /**
   * Get database file path.
   */
  get databasePath() {
    return this.#databasePath;
  }

  /**
   * Check database connection status.
   */
  get isConnected() {
    return Boolean(this.#connection?.open);
  }

  /**
   * Close database connection.
   */
  close() {
    if (!this.#connection?.open) {
      this.#connection = null;
      return;
    }

    try {
      this.#connection.close();
      this.#connection = null;
    } catch (error) {
      throw new Error(
        `Database closing failed: ${error.message}`,
        { cause: error }
      );
    }
  }

  /**
   * Close connection if initialization fails.
   */
  #closeOnError() {
    try {
      if (this.#connection?.open) {
        this.#connection.close();
      }
    } finally {
      this.#connection = null;
    }
  }
}

const database = new DatabaseManager();

export default database;
