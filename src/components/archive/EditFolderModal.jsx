/**
 * EditFolderModal Component
 * نافذة تعديل مجلد
 */

import { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const EditFolderModal = ({ isOpen, onClose, folderId }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // العثور على المجلد
  const findFolder = () => {
    if (!appState.archiveCategories) return null;
    
    for (const category of appState.archiveCategories) {
      const folder = category.folders?.find(f => f.id === folderId);
      if (folder) return folder;
    }
    return null;
  };

  const currentFolder = findFolder();

  useEffect(() => {
    if (currentFolder) {
      setFolderName(currentFolder.name || '');
      setFolderDescription(currentFolder.description || '');
    }
  }, [currentFolder]);

  const handleSave = async () => {
    if (!folderName.trim()) {
      setError('الرجاء إدخال اسم المجلد');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedCategories = appState.archiveCategories.map(cat => ({
        ...cat,
        folders: cat.folders?.map(f => {
          if (f.id === folderId) {
            return {
              ...f,
              name: folderName.trim(),
              description: folderDescription.trim()
            };
          }
          return f;
        })
      }));

      setAppState({
        ...appState,
        archiveCategories: updatedCategories
      });

      await saveData();
      handleClose();
    } catch (err) {
      console.error('Error editing folder:', err);
      setError('حدث خطأ أثناء تعديل المجلد');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFolderName('');
    setFolderDescription('');
    setError('');
    onClose();
  };

  if (!currentFolder) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="تعديل المجلد">
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <Input
          label="اسم المجلد"
          id="edit-folder-name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="أدخل اسم المجلد"
          required
        />

        <div className="form-group" style={{ marginTop: '15px' }}>
          <label htmlFor="edit-folder-description">وصف المجلد</label>
          <textarea
            id="edit-folder-description"
            value={folderDescription}
            onChange={(e) => setFolderDescription(e.target.value)}
            placeholder="وصف اختياري للمجلد..."
            rows="3"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {error && (
          <div className="error-message" style={{ marginTop: '10px', color: '#ef4444' }}>
            {error}
          </div>
        )}

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditFolderModal;
