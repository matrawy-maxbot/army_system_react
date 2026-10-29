/**
 * ArchiveGrid Component
 * شبكة عرض جميع فئات الأرشيف
 */

import { useAppState } from '../../context/AppStateContext';
import ArchiveCategoryCard from './ArchiveCategoryCard';
import './ArchiveGrid.css';

const ArchiveGrid = ({ onAddFolder, onOpenFolder }) => {
  const { appState } = useAppState();

  if (!appState.archiveCategories || appState.archiveCategories.length === 0) {
    return (
      <div className="archive-empty">
        <div className="empty-icon">
          <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
            <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
            <path d="M10 12l4 0" />
          </svg>
        </div>
        <p>لا توجد فئات أرشيف بعد</p>
        <p className="empty-hint">اضغط على "إضافة فئة أرشيف" للبدء</p>
      </div>
    );
  }

  return (
    <div className="archive-grid">
      {appState.archiveCategories.map((category) => (
        <ArchiveCategoryCard
          key={category.id}
          category={category}
          onAddFolder={onAddFolder}
          onOpenFolder={onOpenFolder}
        />
      ))}
    </div>
  );
};

export default ArchiveGrid;
