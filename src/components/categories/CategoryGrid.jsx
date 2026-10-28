/**
 * CategoryGrid Component
 * شبكة عرض جميع الفئات
 */

import { useAppState } from '../../context/AppStateContext';
import CategoryCard from './CategoryCard';

const CategoryGrid = ({ onEditCategory, onAddDocument }) => {
  const { appState } = useAppState();

  if (!appState.categories || appState.categories.length === 0) {
    return (
      <div className="category-empty">
        <div className="category-empty-icon">
          <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
          </svg>
        </div>
        <div>لا توجد فئات. قم بإنشاء فئة جديدة.</div>
      </div>
    );
  }

  return (
    <div id="categoriesContainer" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {appState.categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEditCategory={onEditCategory}
          onAddDocument={onAddDocument}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
