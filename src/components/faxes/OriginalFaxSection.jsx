import React from 'react';
import { dataAPI } from '../../services/electronAPI';
import { useAppState } from '../../context/AppStateContext';

const OriginalFaxSection = ({ onUploadClick, onEditClick, onDeleteClick, onFilterClick }) => {
    const { appState, setAppState } = useAppState();
    const originalFax = appState.originalFax;

    const toggleFavorite = async () => {
        if (!originalFax) return;
        
        const updated = {
            ...appState,
            originalFax: {
                ...originalFax,
                isFavorite: !originalFax.isFavorite
            }
        };
        
        setAppState(updated);
        
        // حفظ البيانات
        await dataAPI.saveData(updated);
    };

    return (
        <section className="original-fax-section">
            <div className="original-fax-header">
                <h2>
                    <svg className="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                    </svg>
                    الفاكس الأصلي
                </h2>
                {!originalFax && (
                    <button className="btn-primary" onClick={onUploadClick}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"/>
                            <path d="M9 15l3 -3l3 3"/>
                            <path d="M12 12l0 9"/>
                        </svg>
                        رفع فاكس أصلي
                    </button>
                )}
            </div>

            {!originalFax ? (
                <div className="original-fax-empty" id="originalFaxEmpty">
                    <div className="empty-icon">
                        <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                        </svg>
                    </div>
                    <p>لم يتم رفع أي فاكس أصلي بعد</p>
                    <p className="empty-hint">قم برفع ملف PDF أو مجموعة صور لتبدأ</p>
                </div>
            ) : (
                <div className="original-fax-box" id="originalFaxBox">
                    <div className="original-fax-preview">
                        <div className="original-fax-icon">
                            <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                            </svg>
                        </div>
                        <div className="original-fax-info">
                            <h3 id="originalFaxName">{originalFax.fileName}</h3>
                            <p id="originalFaxDetails">
                                {originalFax.fileType === 'pdf' ? 'ملف PDF' : 'صور متعددة'} • {originalFax.pageCount} صفحة
                            </p>
                        </div>
                    </div>
                    <div className="original-fax-actions">
                        <button 
                            className={`btn-icon-action ${originalFax.isFavorite ? 'favorite' : ''}`}
                            onClick={toggleFavorite}
                            title={originalFax.isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                        >
                            <svg className="svg-icon" viewBox="0 0 24 24" fill={originalFax.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>
                            </svg>
                        </button>
                        <button className="btn-icon-action" onClick={onEditClick} title="تغيير">
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"/>
                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"/>
                                <path d="M16 5l3 3"/>
                            </svg>
                        </button>
                        <button className="btn-icon-action btn-danger" onClick={onDeleteClick} title="حذف">
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1"/>
                                <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z"/>
                            </svg>
                        </button>
                        <button className="btn-primary" onClick={onFilterClick}>
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z"/>
                            </svg>
                            فلترة الصفحات
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default OriginalFaxSection;
