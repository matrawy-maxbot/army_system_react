import React from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import './DocumentFilters.css';

const DocumentFilters = ({ 
  searchTerm, 
  onSearchChange, 
  sortOrder, 
  onSortChange,
  categoryFilter,
  onCategoryFilterChange,
  categories = []
}) => {
  const sortOptions = [
    { value: 'time-desc', label: 'الأحدث أولاً' },
    { value: 'time-asc', label: 'الأقدم أولاً' },
    { value: 'alpha-asc', label: 'أ - ي' },
    { value: 'alpha-desc', label: 'ي - أ' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'كل الفئات' },
    ...categories.map(cat => ({
      value: cat.id.toString(),
      label: cat.name
    }))
  ];

  return (
    <div className="document-filters">
      <div className="search-filter-group">
        <Input
          type="text"
          placeholder="بحث في المستندات..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-controls-group">
        <Select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          options={sortOptions}
          className="filter-select"
        />

        {categories.length > 0 && (
          <Select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            options={categoryOptions}
            className="filter-select"
          />
        )}
      </div>
    </div>
  );
};

export default DocumentFilters;
