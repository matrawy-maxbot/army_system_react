# Database Implementation Guide

## ✅ Implementation Complete

تم تنفيذ نظام قاعدة البيانات بالكامل وفقًا للمواصفات المتفق عليها.

## 📁 Structure

```
src/main/database/
├── connection/
│   └── database.js              # Singleton connection manager
├── tables/
│   ├── documents.table.js       # Documents schema
│   ├── folders.table.js         # Folders schema  
│   ├── categories.table.js      # Categories schema
│   ├── favorites.table.js       # Favorites schema
│   └── index.js                 # Tables initialization
├── functions/
│   ├── documents.functions.js   # Documents CRUD
│   ├── folders.functions.js     # Folders CRUD
│   ├── categories.functions.js  # Categories CRUD
│   ├── favorites.functions.js   # Favorites CRUD
│   └── index.js                 # Functions export
├── utils/
│   ├── validation.js            # Data validation utilities
│   └── errors.js                # Custom error classes
├── config.js                    # Database configuration
├── index.js                     # Main module export
├── example-usage.js             # Usage examples
└── README.md                    # Full documentation
```

## 🎯 Implemented Features

### 1. Connection Management
- ✅ Singleton pattern (one connection throughout app lifecycle)
- ✅ Automatic database file creation
- ✅ Connection status checking
- ✅ Graceful connection closing
- ✅ Error handling with automatic cleanup

### 2. Database Schema

#### Documents Table
```sql
- id (PRIMARY KEY)
- title (TEXT, required)
- content (TEXT)
- file_path (TEXT)
- file_type (TEXT)
- file_size (INTEGER)
- folder_id (FOREIGN KEY → folders)
- category_id (FOREIGN KEY → categories)
- is_favorite (INTEGER, 0/1)
- is_pinned (INTEGER, 0/1)
- pin_order (INTEGER)
- tags (TEXT)
- created_at (TEXT, auto)
- updated_at (TEXT, auto)
```

#### Folders Table
```sql
- id (PRIMARY KEY)
- name (TEXT, required)
- color (TEXT)
- icon (TEXT)
- parent_id (FOREIGN KEY → folders, for subfolders)
- is_pinned (INTEGER, 0/1)
- pin_order (INTEGER)
- created_at (TEXT, auto)
- updated_at (TEXT, auto)
```

#### Categories Table
```sql
- id (PRIMARY KEY)
- name (TEXT, required, unique)
- color (TEXT)
- icon (TEXT)
- created_at (TEXT, auto)
- updated_at (TEXT, auto)
```

#### Favorites Table
```sql
- id (PRIMARY KEY)
- document_id (FOREIGN KEY → documents, unique)
- added_at (TEXT, auto)
```

### 3. Indexes (for performance)
- ✅ folder_id on documents
- ✅ category_id on documents
- ✅ is_favorite on documents
- ✅ is_pinned on documents
- ✅ created_at on documents
- ✅ parent_id on folders
- ✅ is_pinned on folders
- ✅ document_id on favorites
- ✅ added_at on favorites

### 4. SQLite Configuration
```javascript
{
  foreign_keys: "ON",           // Enable FK constraints
  busy_timeout: 5000,           // Wait 5s if locked
  journal_mode: "WAL",          // Write-Ahead Logging
  synchronous: "NORMAL",        // Balance safety/performance
  temp_store: "MEMORY",         // Temp tables in RAM
  cache_size: -8000             // 8MB cache
}
```

### 5. CRUD Functions

#### Documents (17 functions)
- `createDocument(data)`
- `getDocument(id)`
- `getAllDocuments(filters)` - with optional folder_id, category_id, is_favorite, is_pinned filters
- `updateDocument(id, data)`
- `deleteDocument(id)`
- `searchDocuments(searchTerm)` - search in title and content
- `getPinnedDocuments()`
- `getDocumentsCountByFolder(folderId)`

#### Folders (10 functions)
- `createFolder(data)`
- `getFolder(id)`
- `getAllFolders()`
- `getRootFolders()` - folders without parent
- `getSubfolders(parentId)` - get child folders
- `updateFolder(id, data)`
- `deleteFolder(id)` - cascade delete
- `getPinnedFolders()`
- `getFolderWithCount(id)` - folder with document count
- `getAllFoldersWithCounts()` - all folders with counts

#### Categories (6 functions)
- `createCategory(data)`
- `getCategory(id)`
- `getAllCategories()`
- `updateCategory(id, data)`
- `deleteCategory(id)`
- `getCategoryWithCount(id)` - category with document count
- `getAllCategoriesWithCounts()` - all categories with counts

#### Favorites (5 functions)
- `addToFavorites(documentId)` - uses transaction
- `removeFromFavorites(documentId)` - uses transaction
- `getAllFavorites()` - with full document data
- `isFavorite(documentId)` - boolean check
- `getFavoritesCount()` - total count

### 6. Utilities

#### Validation Functions
- `validateDocument(data)` - validate before insert/update
- `validateFolder(data)` - validate before insert/update
- `validateCategory(data)` - validate before insert/update
- `validateId(id)` - validate ID parameter
- `validateSearchTerm(term)` - validate search input
- `sanitizeString(input)` - additional safety layer

#### Error Classes
- `DatabaseError` - base error class
- `ConnectionError` - connection failures
- `QueryError` - SQL query errors
- `ValidationError` - validation failures
- `NotFoundError` - entity not found
- `DuplicateError` - unique constraint violation
- `ForeignKeyError` - FK constraint violation
- `handleSQLiteError(error, context)` - convert SQLite errors
- `wrapDatabaseOperation(operation, context)` - error wrapper

## 🚀 Quick Start

### 1. Install Package
```bash
npm install better-sqlite3@11.8.1
```
✅ Already installed!

### 2. Initialize in Main Process

```javascript
// main.js
import { app } from "electron";
import { initializeDatabase, closeDatabase, db } from "./database/index.js";

app.whenReady().then(() => {
  const result = initializeDatabase();
  
  if (result.success) {
    console.log("✅ Database ready");
    console.log("📁 Path:", result.path);
  } else {
    console.error("❌ Database failed:", result.message);
  }
});

app.on("before-quit", () => {
  closeDatabase();
});
```

### 3. Use Database Functions

```javascript
// Create folder
const folderId = db.createFolder({
  name: "مستندات مهمة",
  color: "#FF5733",
  icon: "📁"
});

// Create document
const docId = db.createDocument({
  title: "تقرير شهري",
  content: "محتوى التقرير...",
  folder_id: folderId,
  tags: "تقارير,شهري"
});

// Get all documents
const documents = db.getAllDocuments();

// Search
const results = db.searchDocuments("تقرير");

// Add to favorites
db.addToFavorites(docId);

// Get favorites
const favorites = db.getAllFavorites();
```

## 🔗 Next Steps (Not Implemented Yet)

### 1. IPC Handlers
Create IPC handlers to connect React renderer with database:

```javascript
// In main process
import { ipcMain } from "electron";
import { db } from "./database/index.js";

// Get all documents
ipcMain.handle("db:documents:getAll", async (event, filters) => {
  try {
    return {
      success: true,
      data: db.getAllDocuments(filters)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

// Create document
ipcMain.handle("db:documents:create", async (event, data) => {
  try {
    const id = db.createDocument(data);
    return {
      success: true,
      data: { id }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

// Similar handlers for:
// - db:folders:*
// - db:categories:*
// - db:favorites:*
```

```javascript
// In renderer preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("database", {
  documents: {
    getAll: (filters) => ipcRenderer.invoke("db:documents:getAll", filters),
    create: (data) => ipcRenderer.invoke("db:documents:create", data),
    update: (id, data) => ipcRenderer.invoke("db:documents:update", id, data),
    delete: (id) => ipcRenderer.invoke("db:documents:delete", id),
    search: (term) => ipcRenderer.invoke("db:documents:search", term),
  },
  folders: {
    getAll: () => ipcRenderer.invoke("db:folders:getAll"),
    create: (data) => ipcRenderer.invoke("db:folders:create", data),
    // ...
  },
  // ...
});
```

```javascript
// In React
const documents = await window.database.documents.getAll();
const docId = await window.database.documents.create({
  title: "عنوان",
  content: "محتوى"
});
```

### 2. React Integration
- Create React hooks for database operations
- Add state management (Context API or Zustand)
- Implement real-time updates

### 3. Migration System
- Version tracking
- Schema updates
- Data migration scripts

### 4. Backup System
- Automatic periodic backups
- Manual backup trigger
- Restore functionality

### 5. Full-Text Search
- Implement FTS5 virtual table
- Extract text from files
- Advanced search features

### 6. Performance Optimization
- Query result caching
- Batch operations
- Connection pooling (if needed)

## 📋 Design Decisions

### ✅ What We Did Right

1. **Separation of Concerns**
   - Connection isolated in its own module
   - Tables define structure only
   - Functions handle operations only
   - No mixing of responsibilities

2. **Prepared Statements**
   - All queries use prepared statements
   - Protection against SQL injection
   - Better performance through query caching

3. **Transactions**
   - Used in favorites operations
   - Ensures data consistency
   - All-or-nothing execution

4. **Indexes**
   - Created on commonly queried columns
   - Speeds up searches and filters
   - Minimal storage overhead

5. **WAL Mode**
   - Better concurrency
   - Readers don't block writers
   - Improved performance

6. **Foreign Keys**
   - Enabled and enforced
   - Referential integrity
   - Cascade deletes where appropriate

### ❌ What We Avoided

1. ❌ No multiple connections
2. ❌ No SQL in React components
3. ❌ No string concatenation for queries
4. ❌ No mixing of table creation with CRUD
5. ❌ No direct database access from renderer
6. ❌ No complex ORMs or query builders
7. ❌ No premature optimization

## 📊 Performance Expectations

With current setup:
- ✅ Fast queries with indexes
- ✅ Concurrent reads during writes (WAL)
- ✅ Prepared statement caching
- ✅ 8MB memory cache
- ✅ Efficient foreign key lookups

Expected to handle:
- Thousands of documents smoothly
- Complex folder hierarchies
- Multiple concurrent read operations
- Fast search across title and content

## 🛡️ Safety Features

1. **Singleton Connection** - prevents multiple connection issues
2. **Foreign Key Constraints** - prevents orphaned records
3. **Prepared Statements** - prevents SQL injection
4. **Transactions** - ensures data consistency
5. **Error Handling** - graceful failure recovery
6. **Validation** - data integrity checks
7. **Type Checking** - prevents type errors

## 📝 Example Use Cases

### Use Case 1: Document Management
```javascript
// Create category
const catId = db.createCategory({ name: "تقارير", color: "#blue" });

// Create folder
const folderId = db.createFolder({ name: "تقارير 2024" });

// Create document
const docId = db.createDocument({
  title: "تقرير يناير",
  content: "...",
  folder_id: folderId,
  category_id: catId,
  tags: "2024,يناير"
});

// Search
const results = db.searchDocuments("يناير");

// Pin document
db.updateDocument(docId, { is_pinned: 1, pin_order: 1 });

// Add to favorites
db.addToFavorites(docId);
```

### Use Case 2: Folder Hierarchy
```javascript
// Root folder
const rootId = db.createFolder({ name: "الجذر" });

// Subfolders
const sub1Id = db.createFolder({ 
  name: "فرعي 1", 
  parent_id: rootId 
});

const sub2Id = db.createFolder({ 
  name: "فرعي 2", 
  parent_id: rootId 
});

// Get hierarchy
const root = db.getRootFolders();
const children = db.getSubfolders(rootId);
const withCounts = db.getAllFoldersWithCounts();
```

### Use Case 3: Filtered Queries
```javascript
// All favorites
const favorites = db.getAllDocuments({ is_favorite: 1 });

// Documents in folder
const folderDocs = db.getAllDocuments({ folder_id: 5 });

// Documents by category
const categoryDocs = db.getAllDocuments({ category_id: 2 });

// Pinned documents
const pinned = db.getPinnedDocuments();
```

## 🎓 Learning Resources

- SQLite Docs: https://sqlite.org/docs.html
- better-sqlite3: https://github.com/WiseLibs/better-sqlite3
- Electron IPC: https://www.electronjs.org/docs/latest/tutorial/ipc

## ✨ Summary

تم بناء نظام قاعدة بيانات كامل وجاهز للاستخدام مع:

- ✅ هيكل واضح ومنظم
- ✅ فصل تام بين الطبقات
- ✅ جميع عمليات CRUD
- ✅ أمان وأداء عالي
- ✅ معالجة أخطاء شاملة
- ✅ توثيق كامل

الخطوة التالية: ربط قاعدة البيانات مع React عبر IPC handlers.
