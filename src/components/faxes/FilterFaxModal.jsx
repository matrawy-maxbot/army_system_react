import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';

const FilterFaxModal = ({ isOpen, onClose }) => {
    const { appState, setAppState } = useAppState();
    const [tempFaxes, setTempFaxes] = useState([]);
    const [nextFaxNumber, setNextFaxNumber] = useState(1);

    if (!isOpen) return null;

    const pages = appState.faxPages || [];

    const createStandaloneFax = (pageId) => {
        const page = pages.find(p => p.id === pageId);
        if (!page) return;

        const faxId = `fax-${Date.now()}`;
        const faxNumber = nextFaxNumber;

        const newFax = {
            id: faxId,
            faxNumber: faxNumber,
            name: `فاكس ${faxNumber}`,
            pageIds: [pageId],
            dependentPageIds: [],
            isFavorite: false,
            note: '',
            createdDate: new Date().toISOString()
        };

        setTempFaxes(prev => [...prev, newFax]);
        setNextFaxNumber(prev => prev + 1);

        // Update page assignment
        const updatedPages = pages.map(p =>
            p.id === pageId ? { ...p, assignedFaxId: faxId, isStandalone: true } : p
        );
        
        setAppState({
            ...appState,
            faxPages: updatedPages
        });
    };

    const unassignPage = (pageId) => {
        const page = pages.find(p => p.id === pageId);
        if (!page) return;

        if (page.isStandalone) {
            // Remove the fax
            setTempFaxes(prev => prev.filter(f => f.id !== page.assignedFaxId));
        } else {
            // Remove from dependent pages
            setTempFaxes(prev => prev.map(f =>
                f.id === page.assignedFaxId
                    ? { ...f, dependentPageIds: f.dependentPageIds.filter(id => id !== pageId) }
                    : f
            ));
        }

        // Update page
        const updatedPages = pages.map(p =>
            p.id === pageId ? { ...p, assignedFaxId: null, isStandalone: false } : p
        );
        
        setAppState({
            ...appState,
            faxPages: updatedPages
        });
    };

    const handleConfirm = async () => {
        if (tempFaxes.length === 0) {
            alert('الرجاء إنشاء فاكس واحد على الأقل');
            return;
        }

        const filteredFaxes = tempFaxes.map(fax => ({
            ...fax,
            pages: fax.pageIds.map(id => pages.find(p => p.id === id)),
            dependentPages: fax.dependentPageIds.map(id => pages.find(p => p.id === id))
        }));

        const updated = {
            ...appState,
            filteredFaxes: filteredFaxes
        };

        setAppState(updated);
        await window.electronAPI.saveData(updated);
        
        onClose();
    };

    const totalPages = pages.length;
    const assignedPages = pages.filter(p => p.assignedFaxId !== null).length;
    const unassignedPages = totalPages - assignedPages;

    return (
        <div className="modal active">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>فلترة صفحات الفاكس</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="filter-stats">
                        <div className="stat-item">
                            <span className="stat-label">إجمالي الصفحات</span>
                            <span className="stat-value">{totalPages}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">الفاكسات المنشأة</span>
                            <span className="stat-value">{tempFaxes.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">صفحات غير معينة</span>
                            <span className="stat-value">{unassignedPages}</span>
                        </div>
                    </div>

                    <div className="fax-pages-grid" id="faxPagesGrid">
                        {pages.map(page => {
                            const isAssigned = page.assignedFaxId !== null;
                            const isStandalone = page.isStandalone;
                            const fax = tempFaxes.find(f => f.id === page.assignedFaxId);

                            let itemClass = 'fax-page-item';
                            if (isAssigned && isStandalone) itemClass += ' standalone';
                            else if (isAssigned) itemClass += ' dependent';

                            return (
                                <div key={page.id} className={itemClass}>
                                    <div className="fax-page-thumbnail">
                                        <img src={page.thumbnailUrl} alt={`صفحة ${page.pageIndex + 1}`} />
                                        <div className="fax-page-number">صفحة {page.pageIndex + 1}</div>
                                    </div>
                                    <div className="fax-page-actions">
                                        {!isAssigned ? (
                                            <button 
                                                className="fax-page-add-btn"
                                                onClick={() => createStandaloneFax(page.id)}
                                            >
                                                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1"/>
                                                </svg>
                                                إنشاء فاكس مستقل
                                            </button>
                                        ) : (
                                            <>
                                                <div className={`fax-page-assigned ${isStandalone ? 'standalone-badge' : 'dependent-badge'}`}>
                                                    فاكس {fax ? fax.faxNumber : '?'}
                                                </div>
                                                <button 
                                                    className="fax-page-unassign-btn"
                                                    onClick={() => unassignPage(page.id)}
                                                >
                                                    إلغاء التعيين
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        إلغاء
                    </button>
                    <button className="btn-primary" onClick={handleConfirm}>
                        تأكيد ({tempFaxes.length} فاكس)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterFaxModal;
