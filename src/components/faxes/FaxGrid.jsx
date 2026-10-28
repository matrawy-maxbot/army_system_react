import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import FaxCard from './FaxCard';

const FaxGrid = () => {
    const { appState, setAppState } = useAppState();
    const [selectedFaxes, setSelectedFaxes] = useState(new Set());
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

    const clearSelection = () => {
        setSelectedFaxes(new Set());
    };

    const toggleFavorite = async (faxId) => {
        const updated = {
            ...appState,
            filteredFaxes: appState.filteredFaxes.map(fax =>
                fax.id === faxId ? { ...fax, isFavorite: !fax.isFavorite } : fax
            )
        };
        setAppState(updated);
        await window.electronAPI.saveData(updated);
    };

    const deleteSelected = async () => {
        if (selectedFaxes.size === 0) return;

        if (!confirm(`هل أنت متأكد من حذف ${selectedFaxes.size} فاكس؟`)) {
            return;
        }

        const updated = {
            ...appState,
            filteredFaxes: appState.filteredFaxes.filter(fax => !selectedFaxes.has(fax.id))
        };
        
        setAppState(updated);
        await window.electronAPI.saveData(updated);
        setSelectedFaxes(new Set());
    };

    const handleFaxClick = (faxId) => {
        console.log('Open fax detail:', faxId);
        // TODO: إضافة مودال تفاصيل الفاكس
    };

    return (
        <section className="faxes-section">
            <div className="faxes-header">
                <h2>
                    <svg className="svg-icon-md" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z"/>
                    </svg>
                    الفاكسات المفلترة
                    <span className="faxes-count" id="faxesCount">({filteredFaxes.length})</span>
                </h2>
                {selectedFaxes.size > 0 && (
                    <div className="faxes-actions">
                        <span className="selection-count">{selectedFaxes.size} محدد</span>
                        <button className="btn-secondary" onClick={clearSelection}>
                            إلغاء التحديد
                        </button>
                        <button className="btn-danger" onClick={deleteSelected}>
                            <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1"/>
                            </svg>
                            حذف المحدد
                        </button>
                    </div>
                )}
            </div>

            <div className="faxes-grid" id="faxesGrid">
                {filteredFaxes.map(fax => (
                    <FaxCard
                        key={fax.id}
                        fax={fax}
                        isSelected={selectedFaxes.has(fax.id)}
                        onSelect={toggleSelection}
                        onFavorite={toggleFavorite}
                        onClick={handleFaxClick}
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
    );
};

export default FaxGrid;
