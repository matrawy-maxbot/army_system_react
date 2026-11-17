/**
 * Database API for Renderer Process
 * 
 * Exposes database functions to React through contextBridge.
 * This is the secure way to access main process functions.
 */

const { contextBridge, ipcRenderer } = require("electron");

/**
 * Database API exposed to window.database in renderer.
 */
const databaseAPI = {
  
  // ============================================
  // Documents API
  // ============================================
  documents: {
    /**
     * Create a new document.
     * @param {Object} data - Document data
     * @returns {Promise<{success: boolean, data: {id: number}}>}
     */
    create: (data) => ipcRenderer.invoke("db:documents:create", data),
    
    /**
     * Get a document by ID.
     * @param {number} id - Document ID
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    get: (id) => ipcRenderer.invoke("db:documents:get", id),
    
    /**
     * Get all documents with optional filters.
     * @param {Object} filters - Optional filters (folder_id, category_id, etc.)
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getAll: (filters) => ipcRenderer.invoke("db:documents:getAll", filters),
    
    /**
     * Update a document.
     * @param {number} id - Document ID
     * @param {Object} data - Update data
     * @returns {Promise<{success: boolean, data: {changes: number}}>}
     */
    update: (id, data) => ipcRenderer.invoke("db:documents:update", id, data),
    
    /**
     * Delete a document.
     * @param {number} id - Document ID
     * @returns {Promise<{success: boolean, data: {changes: number}}>}
     */
    delete: (id) => ipcRenderer.invoke("db:documents:delete", id),
    
    /**
     * Search documents by term.
     * @param {string} searchTerm - Search term
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    search: (searchTerm) => ipcRenderer.invoke("db:documents:search", searchTerm),
    
    /**
     * Get pinned documents.
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getPinned: () => ipcRenderer.invoke("db:documents:getPinned"),
    
    /**
     * Count documents in a folder.
     * @param {number} folderId - Folder ID
     * @returns {Promise<{success: boolean, data: {count: number}}>}
     */
    countByFolder: (folderId) => ipcRenderer.invoke("db:documents:countByFolder", folderId)
  },
  
  
  // ============================================
  // Folders API
  // ============================================
  folders: {
    /**
     * Create a new folder.
     * @param {Object} data - Folder data
     * @returns {Promise<{success: boolean, data: {id: number}}>}
     */
    create: (data) => ipcRenderer.invoke("db:folders:create", data),
    
    /**
     * Get a folder by ID.
     * @param {number} id - Folder ID
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    get: (id) => ipcRenderer.invoke("db:folders:get", id),
    
    /**
     * Get all folders.
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getAll: () => ipcRenderer.invoke("db:folders:getAll"),
    
    /**
     * Get root folders (without parent).
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getRoots: () => ipcRenderer.invoke("db:folders:getRoots"),
    
    /**
     * Get subfolders of a parent folder.
     * @param {number} parentId - Parent folder ID
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getSubfolders: (parentId) => ipcRenderer.invoke("db:folders:getSubfolders", parentId),
    
    /**
     * Update a folder.
     * @param {number} id - Folder ID
     * @param {Object} data - Update data
     * @returns {Promise<{success: boolean, data: {changes: number}}>}
     */
    update: (id, data) => ipcRenderer.invoke("db:folders:update", id, data),
    
    /**
     * Delete a folder (cascade).
     * @param {number} id - Folder ID
     * @returns {Promise<{success: boolean, data: {changes: number}}>}
     */
    delete: (id) => ipcRenderer.invoke("db:folders:delete", id),
    
    /**
     * Get pinned folders.
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getPinned: () => ipcRenderer.invoke("db:folders:getPinned"),
    
    /**
     * Get a folder with document count.
     * @param {number} id - Folder ID
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getWithCount: (id) => ipcRenderer.invoke("db:folders:getWithCount", id),
    
    /**
     * Get all folders with document counts.
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getAllWithCounts: () => ipcRenderer.invoke("db:folders:getAllWithCounts")
  },
  
  
  // ============================================
  // Categories API
  // ============================================
  categories: {
    /**
     * Create a new category.
     * @param {Object} data - Category data
     * @returns {Promise<{success: boolean, data: {id: number}}>}
     */
    create: (data) => ipcRenderer.invoke("db:categories:create", data),
    
    /**
     * Get a category by ID.
     * @param {number} id - Category ID
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    get: (id) => ipcRenderer.invoke("db:categories:get", id),
    
    /**
     * Get all categories.
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getAll: () => ipcRenderer.invoke("db:categories:getAll"),
    
    /**
     * Update a category.
     * @param {number} id - Category ID
     * @param {Object} data - Update data
     * @returns {Promise<{success: boolean, data: {changes: number}}>}
     */
    update: (id, data) => ipcRenderer.invoke("db:categories:update", id, data),
    
    /**
     * Delete a category.
     * @param {number} id - Category ID
     * @returns {Promise<{success: boolean, data: {changes: number}}>}
     */
    delete: (id) => ipcRenderer.invoke("db:categories:delete", id),
    
    /**
     * Get a category with document count.
     * @param {number} id - Category ID
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getWithCount: (id) => ipcRenderer.invoke("db:categories:getWithCount", id),
    
    /**
     * Get all categories with document counts.
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getAllWithCounts: () => ipcRenderer.invoke("db:categories:getAllWithCounts")
  },
  
  
  // ============================================
  // Favorites API
  // ============================================
  favorites: {
    /**
     * Add a document to favorites.
     * @param {number} documentId - Document ID
     * @returns {Promise<{success: boolean}>}
     */
    add: (documentId) => ipcRenderer.invoke("db:favorites:add", documentId),
    
    /**
     * Remove a document from favorites.
     * @param {number} documentId - Document ID
     * @returns {Promise<{success: boolean}>}
     */
    remove: (documentId) => ipcRenderer.invoke("db:favorites:remove", documentId),
    
    /**
     * Get all favorite documents.
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getAll: () => ipcRenderer.invoke("db:favorites:getAll"),
    
    /**
     * Check if a document is favorite.
     * @param {number} documentId - Document ID
     * @returns {Promise<{success: boolean, data: {isFavorite: boolean}}>}
     */
    check: (documentId) => ipcRenderer.invoke("db:favorites:check", documentId),
    
    /**
     * Get favorites count.
     * @returns {Promise<{success: boolean, data: {count: number}}>}
     */
    count: () => ipcRenderer.invoke("db:favorites:count")
  }
};

/**
 * Expose database API to renderer through contextBridge.
 */
contextBridge.exposeInMainWorld("database", databaseAPI);

console.log("✅ Database API exposed to renderer");
