/**
 * ArchiveGrid Component
 * شبكة عرض جميع فئات الأرشيف مع البحث
 */

import { useMemo } from 'react';
import { useAppState } from '../../context/AppStateContext';
import ArchiveCategoryCard from './ArchiveCategoryCard';
import './ArchiveGrid.css';

const ArchiveGrid = ({ searchQuery, onAddFolder, onOpenFolder, onPinFolder }) => {
  const { appState } = useAppState();

  // Filter categories and folders based on search query
  const filteredCategories = useMemo(() => {
    if (!appState.archiveCategories || appState.archiveCategories.length === 0) {
      return [];
    }

    if (!searchQuery || searchQuery.trim() === '') {
      return appState.archiveCategories;
    }

    const query = searchQuery.trim().toLowerCase();

    // Filter categories that have folders matching the search
    return appState.archiveCategories
      .map(category => {
        const filteredFolders = (category.folders || []).filter(folder =>
          folder.name.toLowerCase().includes(query) ||
          (folder.description && folder.description.toLowerCase().includes(query))
        );

        return {
          ...category,
          folders: filteredFolders
        };
      })
      .filter(category => category.folders.length > 0); // Only show categories with matching folders
  }, [appState.archiveCategories, searchQuery]);

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

  if (searchQuery && filteredCategories.length === 0) {
    return (
      <div className="archive-empty">
        <div className="empty-icon">
          <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <p>لم يتم العثور على مجلدات</p>
        <p className="empty-hint">جرب البحث بكلمات مفتاحية أخرى</p>
      </div>
    );
  }

  return (
    <div className="archive-grid">
      {filteredCategories.map((category) => (
        <ArchiveCategoryCard
          key={category.id}
          category={category}
          onAddFolder={onAddFolder}
          onOpenFolder={onOpenFolder}
          onPinFolder={onPinFolder}
        />
      ))}
    </div>
  );
};

export default ArchiveGrid;
