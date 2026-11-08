/**
 * DatePickerModal Component
 * نافذة اختيار التاريخ المنبثقة
 * تصميم عصري مع تقويم كامل
 */

import React, { useState, useEffect } from 'react';
import './DatePickerModal.css';

const DatePickerModal = ({ isOpen, onClose, onSelectDate, initialDate = new Date() }) => {
    const [currentDate, setCurrentDate] = useState(new Date(initialDate));
    const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
    const [viewMode, setViewMode] = useState('days'); // 'days', 'months', 'years'

    useEffect(() => {
        if (isOpen) {
            setCurrentDate(new Date(initialDate));
            setSelectedDate(new Date(initialDate));
        }
    }, [isOpen, initialDate]);

    const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    // الحصول على الأيام في الشهر
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // أيام من الشهر السابق
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                isToday: false,
                date: new Date(year, month - 1, prevMonthLastDay - i)
            });
        }

        // أيام الشهر الحالي
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            days.push({
                day,
                isCurrentMonth: true,
                isToday: date.getTime() === today.getTime(),
                date
            });
        }

        // أيام من الشهر التالي
        const remainingDays = 42 - days.length; // 6 أسابيع × 7 أيام
        for (let day = 1; day <= remainingDays; day++) {
            days.push({
                day,
                isCurrentMonth: false,
                isToday: false,
                date: new Date(year, month + 1, day)
            });
        }

        return days;
    };

    // التنقل بين الأشهر
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // التنقل بين السنوات
    const goToPreviousYear = () => {
        setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    };

    const goToNextYear = () => {
        setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    };

    // اختيار يوم
    const handleDayClick = (dayData) => {
        setSelectedDate(dayData.date);
    };

    // اختيار شهر
    const handleMonthClick = (monthIndex) => {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
        setViewMode('days');
    };

    // اختيار سنة
    const handleYearClick = (year) => {
        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
        setViewMode('months');
    };

    // تأكيد الاختيار
    const handleConfirm = () => {
        onSelectDate(selectedDate);
        onClose();
    };

    // اختيار اليوم
    const handleTodayClick = () => {
        const today = new Date();
        setSelectedDate(today);
        setCurrentDate(today);
    };

    // التحقق من تطابق التواريخ
    const isSameDate = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    if (!isOpen) return null;

    const days = getDaysInMonth(currentDate);

    // عرض الأشهر
    const renderMonthsView = () => (
        <div className="months-grid">
            {arabicMonths.map((month, index) => (
                <button
                    key={index}
                    className={`month-cell ${currentDate.getMonth() === index ? 'current' : ''}`}
                    onClick={() => handleMonthClick(index)}
                >
                    {month}
                </button>
            ))}
        </div>
    );

    // عرض السنوات
    const renderYearsView = () => {
        const currentYear = currentDate.getFullYear();
        const startYear = Math.floor(currentYear / 12) * 12;
        const years = [];
        for (let i = 0; i < 12; i++) {
            years.push(startYear + i);
        }

        return (
            <div className="years-grid">
                {years.map((year) => (
                    <button
                        key={year}
                        className={`year-cell ${currentDate.getFullYear() === year ? 'current' : ''}`}
                        onClick={() => handleYearClick(year)}
                    >
                        {year}
                    </button>
                ))}
            </div>
        );
    };

    // عرض الأيام
    const renderDaysView = () => (
        <>
            <div className="calendar-weekdays">
                {arabicDays.map((day) => (
                    <div key={day} className="weekday">{day}</div>
                ))}
            </div>
            <div className="calendar-days">
                {days.map((dayData, index) => (
                    <button
                        key={index}
                        className={`day-cell ${!dayData.isCurrentMonth ? 'other-month' : ''} ${
                            dayData.isToday ? 'today' : ''
                        } ${isSameDate(dayData.date, selectedDate) ? 'selected' : ''}`}
                        onClick={() => handleDayClick(dayData)}
                    >
                        {dayData.day}
                    </button>
                ))}
            </div>
        </>
    );

    return (
        <div className="date-picker-overlay" onClick={onClose}>
            <div className="date-picker-modal" onClick={(e) => e.stopPropagation()}>
                <div className="date-picker-header">
                    <h3>اختيار التاريخ</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="date-picker-body">
                    <div className="calendar-header">
                        <button 
                            className="nav-btn" 
                            onClick={viewMode === 'days' ? goToPreviousMonth : 
                                    viewMode === 'months' ? goToPreviousYear : 
                                    () => setCurrentDate(new Date(currentDate.getFullYear() - 12, currentDate.getMonth(), 1))}
                        >
                            ❮
                        </button>
                        
                        <div className="calendar-title">
                            {viewMode === 'days' && (
                                <>
                                    <button 
                                        className="title-btn"
                                        onClick={() => setViewMode('months')}
                                    >
                                        {arabicMonths[currentDate.getMonth()]}
                                    </button>
                                    <button 
                                        className="title-btn"
                                        onClick={() => setViewMode('years')}
                                    >
                                        {currentDate.getFullYear()}
                                    </button>
                                </>
                            )}
                            {viewMode === 'months' && (
                                <button 
                                    className="title-btn"
                                    onClick={() => setViewMode('years')}
                                >
                                    {currentDate.getFullYear()}
                                </button>
                            )}
                            {viewMode === 'years' && (
                                <span className="title-text">
                                    {Math.floor(currentDate.getFullYear() / 12) * 12} - {Math.floor(currentDate.getFullYear() / 12) * 12 + 11}
                                </span>
                            )}
                        </div>

                        <button 
                            className="nav-btn" 
                            onClick={viewMode === 'days' ? goToNextMonth : 
                                    viewMode === 'months' ? goToNextYear : 
                                    () => setCurrentDate(new Date(currentDate.getFullYear() + 12, currentDate.getMonth(), 1))}
                        >
                            ❯
                        </button>
                    </div>

                    <div className="calendar-content">
                        {viewMode === 'days' && renderDaysView()}
                        {viewMode === 'months' && renderMonthsView()}
                        {viewMode === 'years' && renderYearsView()}
                    </div>

                    <div className="selected-date-display">
                        <span className="label">التاريخ المختار:</span>
                        <span className="value">
                            {selectedDate.toLocaleDateString('ar-EG', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                <div className="date-picker-footer">
                    <button className="secondary-btn" onClick={handleTodayClick}>
                        اليوم
                    </button>
                    <div className="footer-actions">
                        <button className="cancel-btn" onClick={onClose}>
                            إلغاء
                        </button>
                        <button className="confirm-btn" onClick={handleConfirm}>
                            تأكيد
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatePickerModal;
