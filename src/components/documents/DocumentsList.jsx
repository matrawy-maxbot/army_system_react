import React, { useState } from 'react';
import DocumentGrid from './DocumentGrid';
import AddDocumentModal from './AddDocumentModal';
import EditDocumentModal from './EditDocumentModal';
import DocumentDetailModal from './DocumentDetailModal';
import { useAppState } from '../../context/AppStateContext';

const DocumentsList = ({ categoryId, selectedDate }) => {
  const { appState, updateDocument, addDocument, deleteDocument } = useAppState();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // العثور على الفئة الحالية
  const category = appState.categories.find(cat => cat.id === categoryId);
  const documents = category?.documents || [];

  const handleOpenDetail = (docId) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setSelectedDocument(doc);
      setIsDetailModalOpen(true);
    }
  };

  const handleOpenSettings = (docId) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setSelectedDocument(doc);
      setIsEditModalOpen(true);
    }
  };

  const handleAddDocument = async (newDoc) => {
    try {
      await addDocument(categoryId, newDoc);
      return true;
    } catch (error) {
      console.error('Error adding document:', error);
      return false;
    }
  };

  const handleUpdateDocument = async (updatedDoc) => {
    try {
      await updateDocument(categoryId, updatedDoc.id, updatedDoc);
      setSelectedDocument(updatedDoc);
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await deleteDocument(categoryId, docId);
      setIsEditModalOpen(false);
      setSelectedDocument(null);
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  };

  return (
    <>
      <DocumentGrid
        documents={documents}
        categoryId={categoryId}
        onOpenDetail={handleOpenDetail}
        onOpenSettings={handleOpenSettings}
      />

      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categoryId={categoryId}
        onSuccess={handleAddDocument}
      />

      <EditDocumentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        categoryId={categoryId}
        onSuccess={handleUpdateDocument}
        onDelete={handleDeleteDocument}
      />

      <DocumentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        categoryId={categoryId}
        selectedDate={selectedDate}
        onUpdate={handleUpdateDocument}
      />
    </>
  );
};

export default DocumentsList;
