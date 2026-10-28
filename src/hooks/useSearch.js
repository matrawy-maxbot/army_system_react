import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Hook للبحث في المستندات والملفات مع debouncing
 * @param {Array} items - المصفوفة المراد البحث فيها
 * @param {Array} searchFields - حقول البحث (مثل ['name', 'description'])
 * @param {number} debounceDelay - مدة التأخير بالمللي ثانية (افتراضي: 300)
 * @returns {Object} - { searchQuery, setSearchQuery, filteredItems, isSearching }
 */
export const useSearch = (items = [], searchFields = ['name'], debounceDelay = 300) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // تطبيق debouncing على استعلام البحث
    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setIsSearching(false);
        }, debounceDelay);

        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery, debounceDelay]);

    // فلترة العناصر بناءً على استعلام البحث
    const filteredItems = useMemo(() => {
        if (!debouncedQuery.trim()) {
            return items;
        }

        const query = debouncedQuery.toLowerCase().trim();
        
        return items.filter(item => {
            // البحث في جميع الحقول المحددة
            return searchFields.some(field => {
                const value = getNestedValue(item, field);
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(query);
            });
        });
    }, [items, debouncedQuery, searchFields]);

    // مسح البحث
    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setDebouncedQuery('');
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        filteredItems,
        isSearching,
        clearSearch
    };
};

/**
 * Hook للبحث المتقدم مع دعم التعبيرات النمطية
 * @param {Array} items - المصفوفة المراد البحث فيها
 * @param {Array} searchFields - حقول البحث
 * @returns {Object} - { searchQuery, setSearchQuery, filteredItems, useRegex, setUseRegex }
 */
export const useAdvancedSearch = (items = [], searchFields = ['name']) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [useRegex, setUseRegex] = useState(false);

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) {
            return items;
        }

        const query = searchQuery.trim();

        return items.filter(item => {
            return searchFields.some(field => {
                const value = getNestedValue(item, field);
                if (value === null || value === undefined) return false;
                const strValue = String(value);

                if (useRegex) {
                    try {
                        const regex = new RegExp(query, 'i');
                        return regex.test(strValue);
                    } catch (error) {
                        // إذا كان التعبير النمطي غير صحيح، استخدم البحث العادي
                        return strValue.toLowerCase().includes(query.toLowerCase());
                    }
                } else {
                    return strValue.toLowerCase().includes(query.toLowerCase());
                }
            });
        });
    }, [items, searchQuery, searchFields, useRegex]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        filteredItems,
        useRegex,
        setUseRegex,
        clearSearch
    };
};

/**
 * دالة مساعدة للحصول على قيمة متداخلة من كائن
 * @param {Object} obj - الكائن
 * @param {string} path - المسار (مثل 'user.name')
 * @returns {*} - القيمة أو null
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
