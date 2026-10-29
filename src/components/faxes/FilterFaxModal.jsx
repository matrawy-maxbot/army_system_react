import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';

const FilterFaxModal = ({ isOpen, onClose }) => {
    const { appState, updateState } = useAppState();
    const [tempFaxes, setTempFaxes] = useState([]);
    const [localPages, setLocalPages] = useState([]);
    const [viewMode, setViewMode] = useState('single'); // 'single', 'double', 'five'

    // Initialize local pages when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setLocalPages(appState.faxPages || []);
            setTempFaxes([]);
        }
    }, [isOpen, appState.faxPages]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        // إغلاق المودال فقط عند الضغط على الخلفية وليس على المحتوى
        if (e.target.classList.contains('modal')) {
            onClose();
        }
    };

    const createStandaloneFax = (pageId) => {
        const page = localPages.find(p => p.id === pageId);
        if (!page) return;

        const faxId = `fax-${Date.now()}`;
        
        // الرقم التالي هو عدد الفاكسات الموجودة + 1
        const faxNumber = tempFaxes.length + 1;

        const newFax = {
            id: faxId,
            faxNumber: faxNumber,
            name: `فاكس ${faxNumber}`,
            pageIds: [pageId],
            dependentPageIds: [],
            note: '',
            createdDate: new Date().toISOString()
        };

        setTempFaxes(prev => [...prev, newFax]);

        // Update page assignment locally
        const updatedPages = localPages.map(p =>
            p.id === pageId ? { ...p, assignedFaxId: faxId, isStandalone: true } : p
        );
        
        setLocalPages(updatedPages);
    };

    const addPageToFax = (pageId, faxId) => {
        const page = localPages.find(p => p.id === pageId);
        const fax = tempFaxes.find(f => f.id === faxId);
        if (!page || !fax) return;

        // Add to dependent pages
        setTempFaxes(prev => prev.map(f =>
            f.id === faxId
                ? { ...f, dependentPageIds: [...f.dependentPageIds, pageId] }
                : f
        ));

        // Update page locally
        const updatedPages = localPages.map(p =>
            p.id === pageId ? { ...p, assignedFaxId: faxId, isStandalone: false } : p
        );
        
        setLocalPages(updatedPages);
    };

    const unassignPage = (pageId) => {
        const page = localPages.find(p => p.id === pageId);
        if (!page) return;

        if (page.isStandalone) {
            // Remove the fax and reorder remaining faxes
            const updatedFaxes = tempFaxes
                .filter(f => f.id !== page.assignedFaxId)
                .map((fax, index) => ({
                    ...fax,
                    faxNumber: index + 1,
                    name: `فاكس ${index + 1}`
                }));
            
            setTempFaxes(updatedFaxes);
        } else {
            // Remove from dependent pages
            setTempFaxes(prev => prev.map(f =>
                f.id === page.assignedFaxId
                    ? { ...f, dependentPageIds: f.dependentPageIds.filter(id => id !== pageId) }
                    : f
            ));
        }

        // Update page locally
        const updatedPages = localPages.map(p =>
            p.id === pageId ? { ...p, assignedFaxId: null, isStandalone: false } : p
        );
        
        setLocalPages(updatedPages);
    };

    const handleConfirm = async () => {
        if (tempFaxes.length === 0) {
            alert('الرجاء إنشاء فاكس واحد على الأقل');
            return;
        }

        const filteredFaxes = tempFaxes.map(fax => ({
            ...fax,
            pages: fax.pageIds.map(id => localPages.find(p => p.id === id)),
            dependentPages: fax.dependentPageIds.map(id => localPages.find(p => p.id === id))
        }));

        await updateState({
            filteredFaxes: filteredFaxes,
            faxPages: localPages
        });
        
        onClose();
    };

    const totalPages = localPages.length;
    const assignedPages = localPages.filter(p => p.assignedFaxId !== null).length;
    const unassignedPages = totalPages - assignedPages;

    const availableFaxes = tempFaxes.filter(f => f.faxNumber);

    return (
        <div className="modal active" id="faxFilterModal" onClick={handleBackdropClick}>
            <div className="modal-content modal-large">
                <div className="modal-header">
                    <button className="btn-close" id="closeFaxFilterModal" onClick={onClose}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                        </svg>
                    </button>
                    
                    <div className="modal-header-content">
                        <h2>
                            <svg className="svg-icon-md" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                                <path d="M4 6l8 0"/>
                                <path d="M16 6l4 0"/>
                                <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                                <path d="M4 12l2 0"/>
                                <path d="M10 12l10 0"/>
                                <path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                                <path d="M4 18l11 0"/>
                                <path d="M19 18l1 0"/>
                            </svg>
                            فلترة صفحات الفاكس - حدد الصفحات التي تخصك
                        </h2>
                        
                        {/* أزرار طرق العرض */}
                        <div className="view-mode-buttons">
                            <button 
                                className={`view-mode-btn ${viewMode === 'single' ? 'active' : ''}`}
                                onClick={() => setViewMode('single')}
                                title="صفحة واحدة بعرض المودال"
                            >
                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="4" y="4" width="16" height="16" rx="2" />
                                </svg>
                                <span>صفحة واحدة</span>
                            </button>
                            <button 
                                className={`view-mode-btn ${viewMode === 'double' ? 'active' : ''}`}
                                onClick={() => setViewMode('double')}
                                title="صفحتان بجانب بعض"
                            >
                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="3" y="4" width="8" height="16" rx="2" />
                                    <rect x="13" y="4" width="8" height="16" rx="2" />
                                </svg>
                                <span>صفحتان</span>
                            </button>
                            <button 
                                className={`view-mode-btn ${viewMode === 'five' ? 'active' : ''}`}
                                onClick={() => setViewMode('five')}
                                title="خمس صفحات"
                            >
                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="2" y="4" width="4" height="16" rx="1" />
                                    <rect x="7" y="4" width="4" height="16" rx="1" />
                                    <rect x="12" y="4" width="4" height="16" rx="1" />
                                    <rect x="17" y="4" width="5" height="16" rx="1" />
                                </svg>
                                <span>خمس صفحات</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="filter-instructions">
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
                        </svg>
                        <div>
                            <strong>طريقة الاستخدام:</strong>
                            <ul>
                                <li>اضغط على زر <strong>(+)</strong> الأزرق لإنشاء فاكس مستقل جديد</li>
                                <li>اضغط على أي <strong>رقم فاكس أخضر</strong> لإضافة الصفحة كتابعة لذلك الفاكس</li>
                                <li>جميع أرقام الفاكسات تظهر تلقائياً على الصفحات غير المخصصة</li>
                                <li>الصفحات المستقلة لها إطار أزرق، والصفحات التابعة لها إطار أخضر</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="filter-stats" id="filterStats">
                        <div className="stat-item">
                            <span className="stat-label">إجمالي الصفحات:</span>
                            <span className="stat-value" id="totalPagesCount">{totalPages}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">الفاكسات المنشأة:</span>
                            <span className="stat-value" id="createdFaxesCount">{tempFaxes.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">صفحات غير مخصصة:</span>
                            <span className="stat-value" id="unassignedPagesCount">{unassignedPages}</span>
                        </div>
                    </div>
                    
                    <div className={`fax-pages-grid view-${viewMode}`} id="faxPagesGrid">
                        {localPages.map(page => {
                            const isAssigned = page.assignedFaxId !== null;
                            const isStandalone = page.isStandalone;
                            const fax = tempFaxes.find(f => f.id === page.assignedFaxId);

                            let itemClass = 'fax-page-item';
                            if (isAssigned && isStandalone) itemClass += ' standalone';
                            else if (isAssigned) itemClass += ' dependent';

                            return (
                                <div 
                                    key={page.id} 
                                    className={itemClass}
                                >
                                    <div className="fax-page-thumbnail">
                                        <img src={page.thumbnailUrl} alt={`صفحة ${page.pageIndex + 1}`} />
                                        <div className="fax-page-number">صفحة {page.pageIndex + 1}</div>
                                        
                                        {/* عرض جميع أرقام الفاكسات المتاحة + زر إضافة فاكس جديد */}
                                        {!isAssigned && availableFaxes.length > 0 && (
                                            <div className="fax-numbers-overlay">
                                                {availableFaxes.map(f => (
                                                    <button
                                                        key={f.id}
                                                        className="fax-number-btn"
                                                        onClick={() => addPageToFax(page.id, f.id)}
                                                        title={`إضافة إلى فاكس ${f.faxNumber}`}
                                                    >
                                                        {f.faxNumber}
                                                    </button>
                                                ))}
                                                <button 
                                                    className="fax-page-add-absolute"
                                                    onClick={() => createStandaloneFax(page.id)}
                                                    title="إنشاء فاكس مستقل جديد"
                                                >
                                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* في حالة عدم وجود فاكسات، عرض زر (+) فقط */}
                                        {!isAssigned && availableFaxes.length === 0 && (
                                            <div className="fax-numbers-overlay">
                                                <button 
                                                    className="fax-page-add-absolute"
                                                    onClick={() => createStandaloneFax(page.id)}
                                                    title="إنشاء فاكس مستقل"
                                                >
                                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* رقم الفاكس المخصص */}
                                        {isAssigned && (
                                            <div className={`fax-number-badge-assigned ${isStandalone ? 'standalone' : 'dependent'}`}>
                                                <span className="fax-number-text">{fax ? fax.faxNumber : '?'}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Overlay للمعلومات والإجراءات */}
                                    <div className="fax-page-overlay">
                                        {isAssigned ? (
                                            <>
                                                <div className={`fax-status-overlay ${isStandalone ? 'standalone' : 'dependent'}`}>
                                                    <svg className="svg-icon-xs" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />
                                                        <rect x="9" y="3" width="6" height="4" rx="2" />
                                                    </svg>
                                                    <span>{isStandalone ? 'فاكس مستقل' : `تابع لفاكس ${fax?.faxNumber}`}</span>
                                                </div>
                                                <button 
                                                    className="fax-unassign-overlay-btn"
                                                    onClick={() => unassignPage(page.id)}
                                                    title="إلغاء التخصيص"
                                                >
                                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <div className="fax-unassigned-overlay">
                                                <svg className="svg-icon-xs" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
                                                </svg>
                                                <span>اختر رقم فاكس أو أنشئ جديداً</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="form-actions" style={{ marginTop: '32px' }}>
                        <button type="button" className="btn-secondary" id="cancelFilterFax" onClick={onClose}>
                            إلغاء
                        </button>
                        <button type="button" className="btn-success" id="confirmFilterFax" onClick={handleConfirm}>
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"/>
                            </svg>
                            تم - حفظ الفاكسات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterFaxModal;
