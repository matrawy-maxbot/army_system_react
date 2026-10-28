import { useState, useMemo, useCallback } from 'react';

/**
 * Hook لتصفية البيانات حسب معايير متعددة
 * @param {Array} items - المصفوفة المراد تصفيتها
 * @param {Object} initialFilters - الفلاتر الافتراضية
 * @returns {Object} - { filteredItems, filters, setFilter, setFilters, clearFilters, activeFilterCount }
 */
export const useFilter = (items = [], initialFilters = {}) => {
    const [filters, setFilters] = useState(initialFilters);

    // تطبيق الفلاتر على العناصر
    const filteredItems = useMemo(() => {
        let result = [...items];

        // تطبيق كل فلتر
        Object.entries(filters).forEach(([key, value]) => {
            // تخطي القيم الفارغة أو null أو undefined
            if (value === null || value === undefined || value === '' || value === 'all') {
                return;
            }

            result = result.filter(item => {
                const itemValue = getNestedValue(item, key);
                
                // معالجة أنواع مختلفة من الفلاتر
                if (Array.isArray(value)) {
                    // فلتر متعدد القيم
                    return value.includes(itemValue);
                } else if (typeof value === 'function') {
                    // فلتر مخصص (دالة)
                    return value(item);
                } else {
                    // فلتر بسيط (مطابقة مباشرة)
                    return itemValue === value;
                }
            });
        });

        return result;
    }, [items, filters]);

    // تعيين فلتر واحد
    const setFilter = useCallback((key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    // مسح جميع الفلاتر
    const clearFilters = useCallback(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    // مسح فلتر واحد
    const clearFilter = useCallback((key) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    }, []);

    // عدد الفلاتر النشطة
    const activeFilterCount = useMemo(() => {
        return Object.values(filters).filter(value => 
            value !== null && value !== undefined && value !== '' && value !== 'all'
        ).length;
    }, [filters]);

    return {
        filteredItems,
        filters,
        setFilter,
        setFilters,
        clearFilters,
        clearFilter,
        activeFilterCount
    };
};

/**
 * Hook لتصفية حسب الفئة
 * @param {Array} items - المصفوفة المراد تصفيتها
 * @param {string} categoryField - اسم حقل الفئة (افتراضي: 'category')
 * @returns {Object} - { filteredItems, selectedCategory, setSelectedCategory, categories }
 */
export const useCategoryFilter = (items = [], categoryField = 'category') => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    // الحصول على جميع الفئات الفريدة
    const categories = useMemo(() => {
        const uniqueCategories = new Set();
        items.forEach(item => {
            const category = getNestedValue(item, categoryField);
            if (category) {
                uniqueCategories.add(category);
            }
        });
        return Array.from(uniqueCategories);
    }, [items, categoryField]);

    // تصفية العناصر حسب الفئة المحددة
    const filteredItems = useMemo(() => {
        if (selectedCategory === 'all') {
            return items;
        }
        return items.filter(item => 
            getNestedValue(item, categoryField) === selectedCategory
        );
    }, [items, selectedCategory, categoryField]);

    return {
        filteredItems,
        selectedCategory,
        setSelectedCategory,
        categories
    };
};

/**
 * Hook لتصفية حسب التاريخ
 * @param {Array} items - المصفوفة المراد تصفيتها
 * @param {string} dateField - اسم حقل التاريخ (افتراضي: 'date')
 * @returns {Object} - { filteredItems, startDate, setStartDate, endDate, setEndDate, clearDateFilter }
 */
export const useDateFilter = (items = [], dateField = 'date') => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // تصفية العناصر حسب نطاق التاريخ
    const filteredItems = useMemo(() => {
        if (!startDate && !endDate) {
            return items;
        }

        return items.filter(item => {
            const itemDate = getNestedValue(item, dateField);
            if (!itemDate) return false;

            const date = new Date(itemDate);
            
            if (startDate && date < startDate) return false;
            if (endDate && date > endDate) return false;
            
            return true;
        });
    }, [items, startDate, endDate, dateField]);

    // مسح فلتر التاريخ
    const clearDateFilter = useCallback(() => {
        setStartDate(null);
        setEndDate(null);
    }, []);

    return {
        filteredItems,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        clearDateFilter
    };
};

/**
 * دالة مساعدة للحصول على قيمة متداخلة من كائن
 */
function getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
        if (value === null || value === undefined) return null;
        value = value[key];
    }
    
    return value;
}
