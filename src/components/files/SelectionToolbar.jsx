import React from 'react';

const SelectionToolbar = ({ 
    selectedCount, 
    totalCount, 
    onSelectAll, 
    onDeselectAll, 
    onPrint, 
    onMerge, 
    onDelete 
}) => {
    return (
        <div className="selection-toolbar">
            <div className="selection-info">
                تم تحديد <span>{selectedCount}</span> من {totalCount}
            </div>
            <div className="selection-actions">
                {selectedCount < totalCount ? (
                    <button 
                        className="btn-toolbar"
                        onClick={onSelectAll}
                    >
                        تحديد الكل
                    </button>
                ) : (
                    <button 
                        className="btn-toolbar"
                        onClick={onDeselectAll}
                    >
                        إلغاء التحديد
                    </button>
                )}
                <button 
                    className="btn-toolbar btn-toolbar-print"
                    onClick={onPrint}
                >
                    طباعة المحدد
                </button>
                <button 
                    className="btn-toolbar btn-toolbar-merge"
                    onClick={onMerge}
                >
                    دمج الملفات
                </button>
                <button 
                    className="btn-toolbar btn-toolbar-delete"
                    onClick={onDelete}
                >
                    حذف المحدد
                </button>
            </div>
        </div>
    );
};

export default SelectionToolbar;
