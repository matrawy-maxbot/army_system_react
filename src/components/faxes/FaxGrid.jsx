import React, { useState } from 'react';
import { dataAPI } from '../../services/electronAPI';
import { useAppState } from '../../context/AppStateContext';
import FaxCard from './FaxCard';
import FaxDetailModal from './FaxDetailModal';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import ConfirmPrintModal from '../common/ConfirmPrintModal';

const FaxGrid = ({ onAddToLists }) => {
    const { appState, setAppState } = useAppState();
    const [selectedFaxes, setSelectedFaxes] = useState(new Set());
    const [selectedFaxId, setSelectedFaxId] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showSinglePrintModal, setShowSinglePrintModal] = useState(false);
    const [currentPrintFax, setCurrentPrintFax] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const filteredFaxes = appState.filteredFaxes || [];

    if (filteredFaxes.length === 0) {
        return null;
    }

    const toggleSelection = (faxId) => {
        const newSelection = new Set(selectedFaxes);
        if (newSelection.has(faxId)) {
            newSelection.delete(faxId);
        } else {
            newSelection.add(faxId);
        }
        setSelectedFaxes(newSelection);
    };

    const selectAll = () => {
        setSelectedFaxes(new Set(filteredFaxes.map(f => f.id)));
    };

    const clearSelection = () => {
        setSelectedFaxes(new Set());
    };

    const toggleFavorite = (fax) => {
        if (onAddToLists) {
            onAddToLists({
                type: 'fax',
                id: fax.id,
                faxNumber: fax.faxNumber,
                name: fax.name
            });
        }
    };

    const deleteSelected = async () => {
        if (selectedFaxes.size === 0) return;
        setShowDeleteModal(true);
    };

    const confirmDeleteSelected = async () => {
        if (selectedFaxes.size === 0) return;

        setIsDeleting(true);

        try {
            const updated = {
                ...appState,
                filteredFaxes: appState.filteredFaxes.filter(fax => !selectedFaxes.has(fax.id))
            };
            
            setAppState(updated);
            await dataAPI.saveData(updated);
            setSelectedFaxes(new Set());
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting faxes:', error);
            alert('حدث خطأ أثناء حذف الفاكسات');
        } finally {
            setIsDeleting(false);
        }
    };

    const printSelected = () => {
        if (selectedFaxes.size === 0) return;
        setShowPrintModal(true);
    };

    const confirmPrintSelected = async () => {
        if (selectedFaxes.size === 0) return;

        setIsPrinting(true);

        try {
            // سيتم تفعيله لاحقاً مع الباك إند
            console.log('Print selected faxes:', Array.from(selectedFaxes));
            
            // محاكاة عملية الطباعة
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert(`تم إرسال ${selectedFaxes.size} فاكس إلى الطابعة`);
            setShowPrintModal(false);
        } catch (error) {
            console.error('Error printing faxes:', error);
            alert('حدث خطأ أثناء الطباعة');
        } finally {
            setIsPrinting(false);
        }
    };

    const deleteSingleFax = async (faxId) => {
        const updated = {
            ...appState,
            filteredFaxes: appState.filteredFaxes.filter(fax => fax.id !== faxId)
        };
        
        setAppState(updated);
        await dataAPI.saveData(updated);
    };

    const handleFaxClick = (faxId) => {
        setSelectedFaxId(faxId);
        setShowDetailModal(true);
    };

    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedFaxId(null);
    };

    const handlePrintSingleFax = (fax) => {
        setCurrentPrintFax(fax);
        setShowSinglePrintModal(true);
    };

    const confirmPrintSingleFax = async () => {
        if (!currentPrintFax) return;

        setIsPrinting(true);

        try {
            // سيتم تفعيله لاحقاً مع الباك إند
            console.log('Print fax:', currentPrintFax.id);
            
            // محاكاة عملية الطباعة
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert(`تم إرسال الفاكس "${currentPrintFax.name}" إلى الطابعة`);
            setShowSinglePrintModal(false);
            setCurrentPrintFax(null);
        } catch (error) {
            console.error('Error printing fax:', error);
            alert('حدث خطأ أثناء الطباعة');
        } finally {
            setIsPrinting(false);
        }
    };

    const handleOpenFolderFax = (fax) => {
        // سيتم تفعيله لاحقاً مع الباك إند
        console.log('Open folder for fax:', fax.id);
    };

    // حساب عدد الصفحات الكلي للفاكسات المحددة
    const getTotalPagesCount = () => {
        let total = 0;
        selectedFaxes.forEach(faxId => {
            const fax = filteredFaxes.find(f => f.id === faxId);
            if (fax) {
                total += (fax.pageIds?.length || 0) + (fax.dependentPageIds?.length || 0);
            }
        });
        return total;
    };

    return (
        <>
            <section className="faxes-section">
                <div className="faxes-header">
                    <h2>
                        <svg className="svg-icon-md" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z"/>
                        </svg>
                        الفاكسات المفلترة
                        <span className="faxes-count" id="faxesCount">({filteredFaxes.length})</span>
                    </h2>
                    <div className="faxes-header-actions">
                        {selectedFaxes.size === 0 ? (
                            <button className="btn-secondary" onClick={selectAll}>
                                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 11l3 3l8 -8"/>
                                    <path d="M7 21h-4a2 2 0 0 1 -2 -2v-4"/>
                                    <path d="M7 3h-4a2 2 0 0 0 -2 2v4"/>
                                    <path d="M17 3h4a2 2 0 0 1 2 2v4"/>
                                    <path d="M17 21h4a2 2 0 0 0 2 -2v-4"/>
                                </svg>
                                تحديد الكل
                            </button>
                        ) : (
                            <div className="faxes-actions">
                                <span className="selection-count">{selectedFaxes.size} محدد</span>
                                <button className="btn-secondary" onClick={clearSelection}>
                                    إلغاء التحديد
                                </button>
                                <button className="btn-success" onClick={printSelected}>
                                    <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"/>
                                        <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"/>
                                        <path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4"/>
                                    </svg>
                                    طباعة المحدد
                                </button>
                                <button className="btn-danger" onClick={deleteSelected}>
                                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1"/>
                                        <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z"/>
                                    </svg>
                                    حذف المحدد
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="faxes-grid" id="faxesGrid">
                    {filteredFaxes.map(fax => (
                        <FaxCard
                            key={fax.id}
                            fax={fax}
                            isSelected={selectedFaxes.has(fax.id)}
                            onSelect={toggleSelection}
                            onFavorite={() => toggleFavorite(fax)}
                            onClick={handleFaxClick}
                            onPrint={handlePrintSingleFax}
                            onOpenFolder={handleOpenFolderFax}
                        />
                    ))}
                </div>

                <div className="faxes-empty" id="faxesEmpty" style={{ display: 'none' }}>
                    <div className="empty-icon">
                        <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </div>
                    <p>لا توجد فاكسات مفلترة</p>
                    <p className="empty-hint">قم بفلترة الفاكس الأصلي أولاً</p>
                </div>
            </section>

            {showDetailModal && (
                <FaxDetailModal
                    isOpen={showDetailModal}
                    onClose={handleCloseDetail}
                    faxId={selectedFaxId}
                    onAddToLists={(fax) => onAddToLists({ type: 'fax', id: fax.id, faxNumber: fax.faxNumber, name: fax.name })}
                    onDelete={deleteSingleFax}
                />
            )}

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteSelected}
                title="تأكيد حذف الفاكسات"
                message="هل أنت متأكد من حذف الفاكسات المحددة؟"
                itemCount={`عدد الفاكسات المحددة: ${selectedFaxes.size}`}
                warningNote="لا يمكن التراجع عن هذا الإجراء"
                loading={isDeleting}
            />

            <ConfirmPrintModal
                isOpen={showPrintModal}
                onClose={() => setShowPrintModal(false)}
                onConfirm={confirmPrintSelected}
                title="تأكيد طباعة الفاكسات"
                message="هل تريد طباعة الفاكسات المحددة؟"
                itemCount={`عدد الفاكسات: ${selectedFaxes.size}`}
                pagesCount={`إجمالي الصفحات: ${getTotalPagesCount()}`}
                loading={isPrinting}
            />

            {currentPrintFax && (
                <ConfirmPrintModal
                    isOpen={showSinglePrintModal}
                    onClose={() => {
                        setShowSinglePrintModal(false);
                        setCurrentPrintFax(null);
                    }}
                    onConfirm={confirmPrintSingleFax}
                    title="تأكيد طباعة الفاكس"
                    message="هل تريد طباعة هذا الفاكس؟"
                    itemName={currentPrintFax.name}
                    pagesCount={`عدد الصفحات: ${(currentPrintFax.pageIds?.length || 0) + (currentPrintFax.dependentPageIds?.length || 0)}`}
                    loading={isPrinting}
                />
            )}
        </>
    );
};

export default FaxGrid;
