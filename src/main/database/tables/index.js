/**
 * Database Tables Creation
 * 
 * Creates all 15 tables with proper relationships,
 * constraints, and indexes as specified.
 */

import database from "../connection/database.js";

/**
 * Initialize all database tables in the correct order.
 */
export function initializeTables() {
  const db = database.connection;

  // 1. archive_categories
  db.exec(`
    CREATE TABLE IF NOT EXISTS archive_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // 2. archive_folders
  db.exec(`
    CREATE TABLE IF NOT EXISTS archive_folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (category_id) REFERENCES archive_categories(id) ON DELETE CASCADE
    )
  `);

  // 3. files - مركزي لجميع الملفات
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      stored_path TEXT NOT NULL,
      original_path TEXT,
      extension TEXT NOT NULL,
      mime_type TEXT,
      size_bytes INTEGER NOT NULL DEFAULT 0,
      folder_id INTEGER,
      source_file_id INTEGER,
      is_pinned INTEGER NOT NULL DEFAULT 0,
      pin_order INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (folder_id) REFERENCES archive_folders(id) ON DELETE SET NULL,
      FOREIGN KEY (source_file_id) REFERENCES files(id) ON DELETE SET NULL
    )
  `);

  // 4. original_faxes
  db.exec(`
    CREATE TABLE IF NOT EXISTS original_faxes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_id INTEGER NOT NULL UNIQUE,
      uploaded_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE RESTRICT
    )
  `);

  // 5. filtered_faxes
  db.exec(`
    CREATE TABLE IF NOT EXISTS filtered_faxes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_fax_id INTEGER NOT NULL,
      file_id INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (original_fax_id) REFERENCES original_faxes(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE RESTRICT,
      
      -- لضمان التحقق من العلاقة في filtered_fax_pages
      UNIQUE(id, original_fax_id)
    )
  `);

  // 6. filtered_fax_pages
  db.exec(`
    CREATE TABLE IF NOT EXISTS filtered_fax_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_fax_id INTEGER NOT NULL,
      filtered_fax_id INTEGER NOT NULL,
      source_page_number INTEGER NOT NULL CHECK (source_page_number > 0),
      page_order INTEGER NOT NULL CHECK (page_order > 0),
      is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
      
      FOREIGN KEY (original_fax_id) REFERENCES original_faxes(id) ON DELETE CASCADE,
      FOREIGN KEY (filtered_fax_id, original_fax_id) REFERENCES filtered_faxes(id, original_fax_id) ON DELETE CASCADE,
      
      -- منع تكرار نفس الصفحة في أكثر من فاكس مفلتر
      UNIQUE(original_fax_id, source_page_number),
      
      -- منع تكرار ترتيب الصفحة داخل نفس الفاكس المفلتر
      UNIQUE(filtered_fax_id, page_order)
    )
  `);

  // 7. templates
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_id INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE RESTRICT
    )
  `);

  // 8. replies - One-to-One مع filtered_faxes
  db.exec(`
    CREATE TABLE IF NOT EXISTS replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filtered_fax_id INTEGER NOT NULL UNIQUE,
      file_id INTEGER NOT NULL UNIQUE,
      template_id INTEGER,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (filtered_fax_id) REFERENCES filtered_faxes(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE RESTRICT,
      FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL
    )
  `);

  // 9. reply_attachments
  db.exec(`
    CREATE TABLE IF NOT EXISTS reply_attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reply_id INTEGER NOT NULL,
      file_id INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (reply_id) REFERENCES replies(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE RESTRICT,
      
      UNIQUE(reply_id, file_id)
    )
  `);

  // 10. lists
  db.exec(`
    CREATE TABLE IF NOT EXISTS lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      is_default INTEGER NOT NULL DEFAULT 0,
      is_system INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // 11. list_items
  db.exec(`
    CREATE TABLE IF NOT EXISTS list_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      item_type TEXT NOT NULL DEFAULT 'file' CHECK (item_type IN ('file', 'original_fax', 'filtered_fax', 'reply')),
      file_id INTEGER NOT NULL,
      added_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
      
      UNIQUE(list_id, item_type, file_id)
    )
  `);

  // 12. reminders
  db.exec(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_fax_id INTEGER,
      filtered_fax_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      start_date TEXT,
      end_date TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (original_fax_id) REFERENCES original_faxes(id) ON DELETE SET NULL,
      FOREIGN KEY (filtered_fax_id) REFERENCES filtered_faxes(id) ON DELETE SET NULL
    )
  `);

  // 13. reminder_attachments
  db.exec(`
    CREATE TABLE IF NOT EXISTS reminder_attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reminder_id INTEGER NOT NULL,
      file_id INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (reminder_id) REFERENCES reminders(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE RESTRICT,
      
      UNIQUE(reminder_id, file_id)
    )
  `);

  // 14. tasks
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      is_completed INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT
    )
  `);

  // 15. settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ============================================
  // Indexes
  // ============================================

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_archive_folders_category_id 
    ON archive_folders(category_id);
    
    CREATE INDEX IF NOT EXISTS idx_files_folder_id 
    ON files(folder_id);
    
    CREATE INDEX IF NOT EXISTS idx_files_source_file_id 
    ON files(source_file_id);
    
    CREATE INDEX IF NOT EXISTS idx_files_created_at 
    ON files(created_at);
    
    CREATE INDEX IF NOT EXISTS idx_files_is_pinned 
    ON files(is_pinned);
    
    CREATE INDEX IF NOT EXISTS idx_original_faxes_uploaded_at 
    ON original_faxes(uploaded_at);
    
    CREATE INDEX IF NOT EXISTS idx_filtered_faxes_original_fax_id 
    ON filtered_faxes(original_fax_id);
    
    CREATE INDEX IF NOT EXISTS idx_filtered_fax_pages_filtered_fax_id 
    ON filtered_fax_pages(filtered_fax_id);
    
    CREATE INDEX IF NOT EXISTS idx_filtered_fax_pages_original_fax_id 
    ON filtered_fax_pages(original_fax_id);
    
    CREATE INDEX IF NOT EXISTS idx_replies_filtered_fax_id 
    ON replies(filtered_fax_id);
    
    CREATE INDEX IF NOT EXISTS idx_reply_attachments_reply_id 
    ON reply_attachments(reply_id);
    
    CREATE INDEX IF NOT EXISTS idx_list_items_list_id 
    ON list_items(list_id);
    
    CREATE INDEX IF NOT EXISTS idx_list_items_file_id 
    ON list_items(file_id);
    
    CREATE INDEX IF NOT EXISTS idx_reminders_original_fax_id 
    ON reminders(original_fax_id);
    
    CREATE INDEX IF NOT EXISTS idx_reminders_filtered_fax_id 
    ON reminders(filtered_fax_id);
    
    CREATE INDEX IF NOT EXISTS idx_reminders_created_at 
    ON reminders(created_at);
    
    CREATE INDEX IF NOT EXISTS idx_tasks_is_completed 
    ON tasks(is_completed);
    
    CREATE INDEX IF NOT EXISTS idx_templates_sort_order 
    ON templates(sort_order);
  `);

  // Partial Unique Index - صفحة رئيسية واحدة كحد أقصى لكل فاكس مفلتر
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_filtered_fax_pages_primary
    ON filtered_fax_pages(filtered_fax_id) 
    WHERE is_primary = 1
  `);

  // ============================================
  // Default Data
  // ============================================

  // إنشاء قائمة Favorites الافتراضية
  db.exec(`
    INSERT OR IGNORE INTO lists (id, name, is_default, is_system) 
    VALUES (1, 'المفضلة', 1, 1)
  `);

  console.log("✅ All 15 tables created successfully");
  console.log("✅ All indexes created successfully");
  console.log("✅ Default Favorites list created");
}
