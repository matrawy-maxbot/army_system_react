import React, { useState, useEffect } from 'react';
import DatePickerModal from '../common/DatePickerModal';
import '../../styles/header.css';

function Header({ onSettingsClick, onDatePickerClick, onArchiveSearch, onSearch }) {
    const [dateDisplay, setDateDisplay] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const currentDate = new Date(now);
            currentDate.setHours(0, 0, 0, 0);
            
            // التحقق إذا كان اليوم
            if (currentDate.getTime() === today.getTime()) {
                setDateDisplay('اليوم');
            } else {
                const options = { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                };
                setDateDisplay(now.toLocaleDateString('ar-EG', options));
            }
        };

        updateDate();
        // تحديث كل دقيقة للتحقق من تغير اليوم
        const interval = setInterval(updateDate, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // إرسال استعلام البحث للمكون الأب (حتى لو كان فارغاً)
        if (onSearch) {
            onSearch(searchQuery);
        }
        // مسح حقل البحث بعد الإرسال إذا كان فارغاً
        if (!searchQuery.trim()) {
            setSearchQuery('');
        }
    };

    const handleDatePickerClick = () => {
        setShowDatePicker(true);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        // إذا كان هناك callback من المكون الأب
        if (onDatePickerClick) {
            onDatePickerClick(date);
        }
    };

    return (
        <>
        <DatePickerModal
            isOpen={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onSelectDate={handleDateSelect}
            initialDate={selectedDate}
        />
        <header className="header">
            <div className="header-content">
                <div className="header-right">
                    <h1>برنامج ادارة نظام مكتب الفاكسات والتدريب</h1>
                </div>
                <div className="header-left">
                    <span className="date-time">{dateDisplay}</span>
                    <button 
                        className="btn-icon date-picker-btn" 
                        onClick={handleDatePickerClick}
                        title="اختيار تاريخ"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </button>
                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <input 
                            type="text"
                            className="search-input"
                            placeholder="بحث في الأرشيف..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-btn" title="بحث">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="M21 21l-4.35-4.35"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </header>
        </>
    );
}

export default Header;
