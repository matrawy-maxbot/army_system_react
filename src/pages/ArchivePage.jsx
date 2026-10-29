/**
 * ArchivePage Component
 * الصفحة الرئيسية لنظام الأرشفة
 */

import { useState } from 'react';
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
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showFolderViewModal, setShowFolderViewModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  
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
        <h1 className="archive-title">
          <svg className="svg-icon-md" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
            <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
            <path d="M10 12l4 0" />
          </svg>
          فئات الأرشيف والمجلدات
        </h1>
        <button 
          className="btn-primary"
          onClick={() => setShowAddCategoryModal(true)}
        >
          <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1" />
          </svg>
          إضافة فئة أرشيف
        </button>
      </div>

      <div className="archive-content">
        <ArchiveGrid
          onAddFolder={handleAddFolder}
          onOpenFolder={handleOpenFolder}
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
