/**
 * FolderGrid Component
 * شبكة عرض المجلدات
 */

import FolderCard from './FolderCard';
import './FolderGrid.css';

const FolderGrid = ({ folders, onOpenFolder }) => {
  if (!folders || folders.length === 0) {
    return (
      <div className="folder-grid-empty">
        <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
          لا توجد مجلدات في هذه الفئة
        </div>
      </div>
    );
  }

  return (
    <div className="folder-grid">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onClick={onOpenFolder}
        />
      ))}
    </div>
  );
};

export default FolderGrid;
