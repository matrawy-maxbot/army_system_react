/**
 * FolderGrid Component
 * شبكة عرض المجلدات - مطابق للتصميم HTML
 */

import FolderCard from './FolderCard';
import './FolderGrid.css';

const FolderGrid = ({ folders, onOpenFolder, onPinFolder }) => {
  if (!folders || folders.length === 0) {
    return null;
  }

  return (
    <>
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onClick={onOpenFolder}
          onPinFolder={onPinFolder}
        />
      ))}
    </>
  );
};

export default FolderGrid;
