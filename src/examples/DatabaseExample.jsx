/**
 * Example Component demonstrating database usage in React.
 * 
 * This shows how to use the custom hooks and database API
 * in your React components.
 */

import React, { useState } from "react";
import {
  useDocuments,
  useFolders,
  useCategories,
  useFavorites,
  useSearch
} from "../hooks/useDatabase";

function DatabaseExample() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use hooks to get data
  const { documents, loading: docsLoading, create: createDoc } = useDocuments();
  const { folders, create: createFolder } = useFolders();
  const { categories, create: createCategory } = useCategories();
  const { favorites, add: addFavorite, remove: removeFavorite } = useFavorites();
  const { results, search } = useSearch();
  
  // Handle creating a new document
  const handleCreateDocument = async () => {
    const result = await createDoc({
      title: "مستند جديد",
      content: "محتوى المستند...",
      tags: "مثال,تجريبي"
    });
    
    if (result.success) {
      console.log("Document created with ID:", result.data.id);
    } else {
      console.error("Error:", result.error);
    }
  };
  
  // Handle creating a new folder
  const handleCreateFolder = async () => {
    const result = await createFolder({
      name: "مجلد جديد",
      color: "#3498db",
      icon: "📁"
    });
    
    if (result.success) {
      console.log("Folder created with ID:", result.data.id);
    }
  };
  
  // Handle creating a new category
  const handleCreateCategory = async () => {
    const result = await createCategory({
      name: "تصنيف جديد",
      color: "#e74c3c"
    });
    
    if (result.success) {
      console.log("Category created with ID:", result.data.id);
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    search(searchTerm);
  };
  
  // Handle favorite toggle
  const toggleFavorite = async (documentId, isFavorite) => {
    if (isFavorite) {
      await removeFavorite(documentId);
    } else {
      await addFavorite(documentId);
    }
  };
  
  if (docsLoading) {
    return <div>جاري التحميل...</div>;
  }
  
  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
      <h1>مثال استخدام قاعدة البيانات</h1>
      
      {/* Actions */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleCreateDocument}>إنشاء مستند</button>
        <button onClick={handleCreateFolder}>إنشاء مجلد</button>
        <button onClick={handleCreateCategory}>إنشاء تصنيف</button>
      </div>
      
      {/* Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث في المستندات..."
          style={{ padding: "8px", width: "300px" }}
        />
        <button type="submit">بحث</button>
      </form>
      
      {/* Search Results */}
      {results.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2>نتائج البحث ({results.length})</h2>
          <ul>
            {results.map((doc) => (
              <li key={doc.id}>{doc.title}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Documents List */}
      <div style={{ marginBottom: "20px" }}>
        <h2>المستندات ({documents.length})</h2>
        <ul>
          {documents.map((doc) => {
            const isFavorite = favorites.some(f => f.id === doc.id);
            
            return (
              <li key={doc.id}>
                {doc.title}
                <button onClick={() => toggleFavorite(doc.id, isFavorite)}>
                  {isFavorite ? "★" : "☆"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Folders List */}
      <div style={{ marginBottom: "20px" }}>
        <h2>المجلدات ({folders.length})</h2>
        <ul>
          {folders.map((folder) => (
            <li key={folder.id}>
              {folder.icon} {folder.name}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Categories List */}
      <div style={{ marginBottom: "20px" }}>
        <h2>التصنيفات ({categories.length})</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id} style={{ color: category.color }}>
              {category.name}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Favorites List */}
      <div>
        <h2>المفضلة ({favorites.length})</h2>
        <ul>
          {favorites.map((doc) => (
            <li key={doc.id}>{doc.title} ★</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DatabaseExample;
