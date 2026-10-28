import React from 'react';

const DateFilter = ({ selectedDate, onDateChange }) => {
    const handleDateChange = (e) => {
        if (e.target.value) {
            const [year, month, day] = e.target.value.split('-').map(Number);
            const newDate = new Date(year, month - 1, day);
            onDateChange(newDate);
        }
    };

    const handleResetDate = () => {
        onDateChange(new Date());
    };

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="search-filter-container">
            <div className="date-filter-container">
                <label className="date-filter-label">التاريخ:</label>
                <input
                    type="date"
                    className="date-filter-input"
                    value={formatDateForInput(selectedDate)}
                    onChange={handleDateChange}
                />
                <button 
                    className="btn-reset-date"
                    onClick={handleResetDate}
                >
                    اليوم
                </button>
            </div>
        </div>
    );
};

export default DateFilter;
