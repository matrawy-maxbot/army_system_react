import React from 'react';

const FaxCard = ({ fax, isSelected, onSelect, onFavorite, onClick }) => {
    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        onSelect(fax.id);
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        onFavorite(fax.id);
    };

    return (
        <div 
            className={`fax-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick(fax.id)}
        >
            <div className="fax-checkbox" onClick={handleCheckboxClick}>
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11l3 3l8 -8"/>
                    <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9"/>
                </svg>
            </div>

            <button 
                className={`fax-favorite-btn ${fax.isFavorite ? 'favorite' : ''}`}
                onClick={handleFavoriteClick}
            >
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill={fax.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>
                </svg>
            </button>

            <div className="fax-preview">
                <div className="fax-number">{fax.faxNumber}</div>
                <div className="fax-pages-count">{(fax.pageIds?.length || 0) + (fax.dependentPageIds?.length || 0)} صفحة</div>
            </div>

            <div className="fax-info">
                <h3 className="fax-name">{fax.name}</h3>
                {fax.note && <p className="fax-note">{fax.note}</p>}
            </div>

            <div className="fax-actions">
                <button className="btn-fax-action btn-open" title="فتح">
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
                <button className="btn-fax-action btn-print" title="طباعة">
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"/>
                        <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"/>
                        <path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FaxCard;
