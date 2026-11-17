/**
 * React Hooks for Database Operations
 * 
 * Custom hooks that make it easy to use database
 * functions in React components.
 */

import { useState, useEffect, useCallback } from "react";

/**
 * Hook for managing documents.
 */
export function useDocuments(filters = {}) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await window.database.documents.getAll(filters);
      
      if (result.success) {
        setDocuments(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  const createDocument = async (data) => {
    const result = await window.database.documents.create(data);
    if (result.success) {
      await fetchDocuments();
    }
    return result;
  };
  
  const updateDocument = async (id, data) => {
    const result = await window.database.documents.update(id, data);
    if (result.success) {
      await fetchDocuments();
    }
    return result;
  };
  
  const deleteDocument = async (id) => {
    const result = await window.database.documents.delete(id);
    if (result.success) {
      await fetchDocuments();
    }
    return result;
  };
  
  return {
    documents,
    loading,
    error,
    refresh: fetchDocuments,
    create: createDocument,
    update: updateDocument,
    delete: deleteDocument
  };
}

/**
 * Hook for managing folders.
 */
export function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await window.database.folders.getAll();
      
      if (result.success) {
        setFolders(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);
  
  const createFolder = async (data) => {
    const result = await window.database.folders.create(data);
    if (result.success) {
      await fetchFolders();
    }
    return result;
  };
  
  const updateFolder = async (id, data) => {
    const result = await window.database.folders.update(id, data);
    if (result.success) {
      await fetchFolders();
    }
    return result;
  };
  
  const deleteFolder = async (id) => {
    const result = await window.database.folders.delete(id);
    if (result.success) {
      await fetchFolders();
    }
    return result;
  };
  
  return {
    folders,
    loading,
    error,
    refresh: fetchFolders,
    create: createFolder,
    update: updateFolder,
    delete: deleteFolder
  };
}

/**
 * Hook for managing categories.
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await window.database.categories.getAll();
      
      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  const createCategory = async (data) => {
    const result = await window.database.categories.create(data);
    if (result.success) {
      await fetchCategories();
    }
    return result;
  };
  
  const updateCategory = async (id, data) => {
    const result = await window.database.categories.update(id, data);
    if (result.success) {
      await fetchCategories();
    }
    return result;
  };
  
  const deleteCategory = async (id) => {
    const result = await window.database.categories.delete(id);
    if (result.success) {
      await fetchCategories();
    }
    return result;
  };
  
  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    create: createCategory,
    update: updateCategory,
    delete: deleteCategory
  };
}

/**
 * Hook for managing favorites.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await window.database.favorites.getAll();
      
      if (result.success) {
        setFavorites(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);
  
  const addToFavorites = async (documentId) => {
    const result = await window.database.favorites.add(documentId);
    if (result.success) {
      await fetchFavorites();
    }
    return result;
  };
  
  const removeFromFavorites = async (documentId) => {
    const result = await window.database.favorites.remove(documentId);
    if (result.success) {
      await fetchFavorites();
    }
    return result;
  };
  
  const checkFavorite = async (documentId) => {
    const result = await window.database.favorites.check(documentId);
    return result.success ? result.data.isFavorite : false;
  };
  
  return {
    favorites,
    loading,
    error,
    refresh: fetchFavorites,
    add: addToFavorites,
    remove: removeFromFavorites,
    check: checkFavorite
  };
}

/**
 * Hook for searching documents.
 */
export function useSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const search = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await window.database.documents.search(searchTerm);
      
      if (result.success) {
        setResults(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const clear = () => {
    setResults([]);
    setError(null);
  };
  
  return {
    results,
    loading,
    error,
    search,
    clear
  };
}

/**
 * Hook for getting a single document.
 */
export function useDocument(documentId) {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchDocument = useCallback(async () => {
    if (!documentId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await window.database.documents.get(documentId);
      
      if (result.success) {
        setDocument(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [documentId]);
  
  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);
  
  return {
    document,
    loading,
    error,
    refresh: fetchDocument
  };
}

/**
 * Hook for getting a single folder.
 */
export function useFolder(folderId) {
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchFolder = useCallback(async () => {
    if (!folderId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await window.database.folders.getWithCount(folderId);
      
      if (result.success) {
        setFolder(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [folderId]);
  
  useEffect(() => {
    fetchFolder();
  }, [fetchFolder]);
  
  return {
    folder,
    loading,
    error,
    refresh: fetchFolder
  };
}
