import React from 'react';
import { useAppState } from '../../context/AppStateContext';

const FaxCard = ({ fax, isSelected, onSelect, onFavorite, onClick, onPrint, onOpenFolder }) => {
    const { appState } = useAppState();

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        onSelect(fax.id);
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        onFavorite();
    };

    const handlePrintClick = (e) => {
        e.stopPropagation();
        if (onPrint) onPrint(fax);
    };

    const handleOpenFolderClick = (e) => {
        e.stopPropagation();
        if (onOpenFolder) onOpenFolder(fax);
    };

    // التحقق من وجود الفاكس في أي قائمة
    const isInAnyList = () => {
        if (!appState.lists) return false;
        
        return appState.lists.some(list => 
            list.items?.some(item => 
                item.type === 'fax' && item.itemId === fax.id
            )
        );
    };

    // الحصول على صورة الصفحة الأولى من الفاكس
    const getFirstPageImage = () => {
        const pages = appState.faxPages || [];
        const firstPageId = fax.pageIds?.[0];
        if (firstPageId) {
            const page = pages.find(p => p.id === firstPageId);
            return page?.thumbnailUrl;
        }
        return null;
    };

    const firstPageImage = getFirstPageImage();

    return (
        <div 
            className={`fax-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick(fax.id)}
        >
            {/* منطقة الصورة مع overlay */}
            <div className="fax-card-image-container">
                {firstPageImage ? (
                    <img src={firstPageImage} alt={fax.name} className="fax-card-image" />
                ) : (
                    <div className="fax-card-placeholder">
                        <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z"/>
                        </svg>
                    </div>
                )}

                {/* زر المفضلة الثابت (إذا كان في قائمة) */}
                {isInAnyList() && (
                    <button 
                        className="fax-favorite-btn-fixed in-list"
                        onClick={handleFavoriteClick}
                        title="موجود في القوائم"
                    >
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                            <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>
                        </svg>
                    </button>
                )}

                {/* Overlay مع الأزرار والمعلومات */}
                <div className="fax-card-overlay">
                    {/* الأزرار العلوية */}
                    <div className="fax-card-top-actions">
                        <div className="fax-checkbox" onClick={handleCheckboxClick}>
                            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>

                        {/* زر المفضلة في الـ overlay (يظهر فقط إذا لم يكن في قائمة) */}
                        {!isInAnyList() && (
                            <button 
                                className="fax-favorite-btn"
                                onClick={handleFavoriteClick}
                                title="إضافة إلى القوائم"
                            >
                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* معلومات الفاكس في الوسط */}
                    <div className="fax-card-center-info">
                        <h3 className="fax-overlay-name">{fax.name}</h3>
                        {fax.note && (
                            <p className="fax-overlay-note">{fax.note}</p>
                        )}
                    </div>

                    {/* أزرار الإجراءات السفلية */}
                    <div className="fax-card-actions">
                        <button className="btn-fax-action" onClick={handleOpenFolderClick} title="فتح المجلد">
                            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"/>
                            </svg>
                        </button>
                        <button className="btn-fax-action" onClick={handlePrintClick} title="طباعة">
                            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"/>
                                <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"/>
                                <path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaxCard;
