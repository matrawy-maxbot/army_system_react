/**
 * ArchivePage Component
 * الصفحة الرئيسية لنظام الأرشفة
 */

import { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import {
  ArchiveGrid,
  AddArchiveCategoryModal,
  AddFolderModal,
  FolderViewModal,
  EditFolderModal,
  MoveFolderModal,
  DeleteFolderModal
} from '../components/archive';
import './ArchivePage.css';

const ArchivePage = () => {
  const { appState, setAppState, saveData } = useAppState();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showFolderViewModal, setShowFolderViewModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const handleAddFolder = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowAddFolderModal(true);
  };

  const handleOpenFolder = (folderId) => {
    setSelectedFolderId(folderId);
    setShowFolderViewModal(true);
  };

  const handlePinFolder = async (folder) => {
    // Toggle pin state
    const updatedCategories = appState.archiveCategories.map(category => {
      if (category.folders) {
        return {
          ...category,
          folders: category.folders.map(f => 
            f.id === folder.id ? { ...f, isPinned: !f.isPinned } : f
          )
        };
      }
      return category;
    });

    setAppState({
      ...appState,
      archiveCategories: updatedCategories
    });

    await saveData();
  };

  const handleEditFolder = (folderId) => {
    setSelectedFolderId(folderId);
    setShowFolderViewModal(false);
    setShowEditFolderModal(true);
  };

  const handleMoveFolder = (folderId) => {
    setSelectedFolderId(folderId);
    setShowFolderViewModal(false);
    setShowMoveFolderModal(true);
  };

  const handleDeleteFolder = (folderId) => {
    setSelectedFolderId(folderId);
    setShowFolderViewModal(false);
    setShowDeleteFolderModal(true);
  };

  const handleDeleteComplete = () => {
    setShowDeleteFolderModal(false);
    setSelectedFolderId(null);
  };

  return (
    <div className="archive-page">
      <div className="archive-header-section">
        <div className="archive-header-text">
          <div className="title-desc">
            <h1>فئات الأرشيف والمجلدات</h1>
            <p>إدارة وتنظيم مستندات الأرشيف</p>
          </div>
          <div className="search-area">
            <label className="search">
              <div className="search-box" style={{margin:0}}>
                <input 
                  type="text"
                  id="search"
                  placeholder="البحث عن مجلد او ملف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
          </div>
        </div>
        <button 
          className="primary-btn"
          onClick={() => setShowAddCategoryModal(true)}
        >
          + إضافة فئة أرشيف
        </button>
      </div>

      <div className="archive-content">
        <ArchiveGrid
          searchQuery={searchQuery}
          onAddFolder={handleAddFolder}
          onOpenFolder={handleOpenFolder}
          onPinFolder={handlePinFolder}
        />
      </div>

      {/* Modals */}
      <AddArchiveCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
      />

      <AddFolderModal
        isOpen={showAddFolderModal}
        onClose={() => {
          setShowAddFolderModal(false);
          setSelectedCategoryId(null);
        }}
        categoryId={selectedCategoryId}
      />

      <FolderViewModal
        isOpen={showFolderViewModal}
        onClose={() => {
          setShowFolderViewModal(false);
          setSelectedFolderId(null);
        }}
        folderId={selectedFolderId}
        onEdit={handleEditFolder}
        onMove={handleMoveFolder}
        onDelete={handleDeleteFolder}
      />

      <EditFolderModal
        isOpen={showEditFolderModal}
        onClose={() => {
          setShowEditFolderModal(false);
          setSelectedFolderId(null);
        }}
        folderId={selectedFolderId}
      />

      <MoveFolderModal
        isOpen={showMoveFolderModal}
        onClose={() => {
          setShowMoveFolderModal(false);
          setSelectedFolderId(null);
        }}
        folderId={selectedFolderId}
      />

      <DeleteFolderModal
        isOpen={showDeleteFolderModal}
        onClose={handleDeleteComplete}
        folderId={selectedFolderId}
      />
    </div>
  );
};

export default ArchivePage;
