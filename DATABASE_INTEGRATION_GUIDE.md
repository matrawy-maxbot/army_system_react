# Database Integration Guide

## Step-by-Step Integration

This guide shows how to integrate the database system into your Electron app.

## 📋 Prerequisites

✅ better-sqlite3 installed  
✅ Database structure created  
✅ IPC handlers created  
✅ Preload API created  
✅ React hooks created

## 🔧 Step 1: Update Main Process (main.js)

```javascript
import { app, BrowserWindow } from "electron";
import path from "path";
import { initializeDatabase, closeDatabase } from "./database/index.js";
import { registerDatabaseHandlers } from "./ipc/database-handlers.js";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload/database-api.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  // Initialize database
  const dbResult = initializeDatabase();
  
  if (dbResult.success) {
    console.log("✅ Database initialized");
    console.log("📁 Path:", dbResult.path);
    
    // Register IPC handlers
    registerDatabaseHandlers();
    
    // Create window
    createWindow();
  } else {
    console.error("❌ Database initialization failed:", dbResult.message);
    app.quit();
  }
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  closeDatabase();
  console.log("✅ Database closed");
});
```

## 🔧 Step 2: Update Preload Script

If you already have a preload script, merge database-api.js into it:

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// Your existing APIs
contextBridge.exposeInMainWorld("electron", {
  // ... your existing APIs
});

// Database API (from database-api.js)
contextBridge.exposeInMainWorld("database", {
  documents: {
    create: (data) => ipcRenderer.invoke("db:documents:create", data),
    get: (id) => ipcRenderer.invoke("db:documents:get", id),
    getAll: (filters) => ipcRenderer.invoke("db:documents:getAll", filters),
    update: (id, data) => ipcRenderer.invoke("db:documents:update", id, data),
    delete: (id) => ipcRenderer.invoke("db:documents:delete", id),
    search: (term) => ipcRenderer.invoke("db:documents:search", term),
    getPinned: () => ipcRenderer.invoke("db:documents:getPinned"),
    countByFolder: (folderId) => ipcRenderer.invoke("db:documents:countByFolder", folderId)
  },
  folders: {
    create: (data) => ipcRenderer.invoke("db:folders:create", data),
    get: (id) => ipcRenderer.invoke("db:folders:get", id),
    getAll: () => ipcRenderer.invoke("db:folders:getAll"),
    getRoots: () => ipcRenderer.invoke("db:folders:getRoots"),
    getSubfolders: (parentId) => ipcRenderer.invoke("db:folders:getSubfolders", parentId),
    update: (id, data) => ipcRenderer.invoke("db:folders:update", id, data),
    delete: (id) => ipcRenderer.invoke("db:folders:delete", id),
    getPinned: () => ipcRenderer.invoke("db:folders:getPinned"),
    getWithCount: (id) => ipcRenderer.invoke("db:folders:getWithCount", id),
    getAllWithCounts: () => ipcRenderer.invoke("db:folders:getAllWithCounts")
  },
  categories: {
    create: (data) => ipcRenderer.invoke("db:categories:create", data),
    get: (id) => ipcRenderer.invoke("db:categories:get", id),
    getAll: () => ipcRenderer.invoke("db:categories:getAll"),
    update: (id, data) => ipcRenderer.invoke("db:categories:update", id, data),
    delete: (id) => ipcRenderer.invoke("db:categories:delete", id),
    getWithCount: (id) => ipcRenderer.invoke("db:categories:getWithCount", id),
    getAllWithCounts: () => ipcRenderer.invoke("db:categories:getAllWithCounts")
  },
  favorites: {
    add: (documentId) => ipcRenderer.invoke("db:favorites:add", documentId),
    remove: (documentId) => ipcRenderer.invoke("db:favorites:remove", documentId),
    getAll: () => ipcRenderer.invoke("db:favorites:getAll"),
    check: (documentId) => ipcRenderer.invoke("db:favorites:check", documentId),
    count: () => ipcRenderer.invoke("db:favorites:count")
  }
});
```

## 🔧 Step 3: Use in React Components

### Option A: Using Hooks (Recommended)

```jsx
import React from "react";
import { useDocuments, useFolders } from "./hooks/useDatabase";

function MyComponent() {
  const { documents, loading, create, update, delete: deleteDoc } = useDocuments();
  const { folders } = useFolders();
  
  const handleCreate = async () => {
    const result = await create({
      title: "مستند جديد",
      content: "محتوى...",
      folder_id: folders[0]?.id
    });
    
    if (result.success) {
      console.log("Created:", result.data.id);
    }
  };
  
  if (loading) return <div>جاري التحميل...</div>;
  
  return (
    <div>
      <button onClick={handleCreate}>إنشاء مستند</button>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>{doc.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Option B: Direct API Calls

```jsx
import React, { useState, useEffect } from "react";

function MyComponent() {
  const [documents, setDocuments] = useState([]);
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const loadDocuments = async () => {
    const result = await window.database.documents.getAll();
    if (result.success) {
      setDocuments(result.data);
    }
  };
  
  const handleCreate = async () => {
    const result = await window.database.documents.create({
      title: "مستند جديد",
      content: "محتوى..."
    });
    
    if (result.success) {
      loadDocuments(); // Refresh
    }
  };
  
  return (
    <div>
      <button onClick={handleCreate}>إنشاء</button>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>{doc.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 📝 Common Usage Patterns

### 1. Create Document with Folder and Category

```javascript
const result = await window.database.documents.create({
  title: "تقرير شهري",
  content: "محتوى التقرير...",
  folder_id: 1,
  category_id: 2,
  tags: "تقارير,شهري,2024"
});
```

### 2. Get Documents in Folder

```javascript
const result = await window.database.documents.getAll({
  folder_id: 1
});
```

### 3. Search Documents

```javascript
const result = await window.database.documents.search("تقرير");
if (result.success) {
  console.log("Found:", result.data.length);
}
```

### 4. Add to Favorites

```javascript
await window.database.favorites.add(documentId);
```

### 5. Create Folder Hierarchy

```javascript
// Root folder
const rootResult = await window.database.folders.create({
  name: "مستندات رئيسية",
  color: "#3498db"
});

// Subfolder
const subResult = await window.database.folders.create({
  name: "مستندات فرعية",
  parent_id: rootResult.data.id
});
```

### 6. Get Folder with Document Count

```javascript
const result = await window.database.folders.getWithCount(folderId);
if (result.success) {
  console.log(`${result.data.name}: ${result.data.document_count} documents`);
}
```

### 7. Update Document

```javascript
await window.database.documents.update(documentId, {
  title: "عنوان محدث",
  is_pinned: 1,
  pin_order: 1
});
```

### 8. Delete with Confirmation

```javascript
const handleDelete = async (docId) => {
  if (window.confirm("هل تريد الحذف؟")) {
    const result = await window.database.documents.delete(docId);
    if (result.success) {
      // Refresh list
    }
  }
};
```

## 🎯 Real-World Example: Document Manager

```jsx
import React from "react";
import { useDocuments, useFolders, useCategories } from "./hooks/useDatabase";

function DocumentManager() {
  const { 
    documents, 
    loading, 
    create, 
    update, 
    delete: deleteDoc 
  } = useDocuments();
  
  const { folders } = useFolders();
  const { categories } = useCategories();
  
  const [formData, setFormData] = React.useState({
    title: "",
    content: "",
    folder_id: null,
    category_id: null
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await create(formData);
    
    if (result.success) {
      alert("تم إنشاء المستند بنجاح");
      setFormData({ title: "", content: "", folder_id: null, category_id: null });
    } else {
      alert("خطأ: " + result.error);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("هل تريد حذف هذا المستند؟")) {
      await deleteDoc(id);
    }
  };
  
  const handlePin = async (doc) => {
    await update(doc.id, {
      is_pinned: doc.is_pinned ? 0 : 1
    });
  };
  
  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }
  
  return (
    <div className="document-manager">
      <h1>إدارة المستندات</h1>
      
      {/* Create Form */}
      <form onSubmit={handleSubmit} className="create-form">
        <input
          type="text"
          placeholder="عنوان المستند"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        
        <textarea
          placeholder="محتوى المستند"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
        />
        
        <select
          value={formData.folder_id || ""}
          onChange={(e) => setFormData({...formData, folder_id: e.target.value || null})}
        >
          <option value="">بدون مجلد</option>
          {folders.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        
        <select
          value={formData.category_id || ""}
          onChange={(e) => setFormData({...formData, category_id: e.target.value || null})}
        >
          <option value="">بدون تصنيف</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        
        <button type="submit">إنشاء مستند</button>
      </form>
      
      {/* Documents List */}
      <div className="documents-list">
        <h2>المستندات ({documents.length})</h2>
        {documents.map(doc => (
          <div key={doc.id} className="document-card">
            <h3>{doc.title}</h3>
            <p>{doc.content?.substring(0, 100)}...</p>
            <div className="actions">
              <button onClick={() => handlePin(doc)}>
                {doc.is_pinned ? "📌" : "📍"}
              </button>
              <button onClick={() => handleDelete(doc.id)}>🗑️</button>
            </div>
            <small>
              {new Date(doc.created_at).toLocaleDateString("ar-EG")}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentManager;
```

## 🔍 TypeScript Support (Optional)

Create type definitions:

```typescript
// types/database.d.ts
interface Document {
  id: number;
  title: string;
  content: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: number | null;
  folder_id: number | null;
  category_id: number | null;
  is_favorite: number;
  is_pinned: number;
  pin_order: number | null;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

interface Folder {
  id: number;
  name: string;
  color: string | null;
  icon: string | null;
  parent_id: number | null;
  is_pinned: number;
  pin_order: number | null;
  created_at: string;
  updated_at: string;
  document_count?: number;
}

interface Category {
  id: number;
  name: string;
  color: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
  document_count?: number;
}

interface DatabaseResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}

interface DatabaseAPI {
  documents: {
    create: (data: Partial<Document>) => Promise<DatabaseResponse<{id: number}>>;
    get: (id: number) => Promise<DatabaseResponse<Document>>;
    getAll: (filters?: object) => Promise<DatabaseResponse<Document[]>>;
    update: (id: number, data: Partial<Document>) => Promise<DatabaseResponse<{changes: number}>>;
    delete: (id: number) => Promise<DatabaseResponse<{changes: number}>>;
    search: (term: string) => Promise<DatabaseResponse<Document[]>>;
    getPinned: () => Promise<DatabaseResponse<Document[]>>;
    countByFolder: (folderId: number) => Promise<DatabaseResponse<{count: number}>>;
  };
  // ... similar for folders, categories, favorites
}

declare global {
  interface Window {
    database: DatabaseAPI;
  }
}
```

## ✅ Testing the Integration

1. **Test Database Initialization**
```javascript
// In main.js, after initialization
console.log("Database status:", getDatabaseStatus());
```

2. **Test IPC from DevTools**
```javascript
// Open DevTools in your app
const result = await window.database.documents.getAll();
console.log("Documents:", result);
```

3. **Test CRUD Operations**
```javascript
// Create
const doc = await window.database.documents.create({
  title: "Test",
  content: "Testing..."
});

// Read
const result = await window.database.documents.get(doc.data.id);
console.log(result.data);

// Update
await window.database.documents.update(doc.data.id, {
  title: "Updated Title"
});

// Delete
await window.database.documents.delete(doc.data.id);
```

## 🚨 Troubleshooting

### Database not initialized
- Check if `initializeDatabase()` is called in `app.whenReady()`
- Check console for initialization errors

### window.database is undefined
- Verify preload script is loaded correctly
- Check `webPreferences.preload` path
- Ensure `contextIsolation: true`

### IPC handler not found
- Verify `registerDatabaseHandlers()` is called
- Check handler name matches exactly
- Look for typos in channel names

### Data not refreshing
- Call `refresh()` after mutations when using hooks
- Or reload data manually after create/update/delete

## 📚 Next Steps

1. Add error boundaries in React
2. Implement optimistic updates
3. Add data caching layer
4. Implement real-time sync between windows
5. Add database migrations system
6. Implement backup/restore features

## 🎉 Summary

You now have:
- ✅ Complete database system
- ✅ IPC communication layer
- ✅ Secure preload API
- ✅ React hooks for easy usage
- ✅ Example components
- ✅ Full documentation

Ready to build powerful desktop applications with local database! 🚀
