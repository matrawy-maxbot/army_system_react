import React from 'react';

const ReminderCard = ({ reminder, onEdit }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={`reminder-card ${reminder.isExpired ? 'expired' : 'active'}`}>
            <div className="reminder-status">
                <span className={`reminder-status-badge ${reminder.isExpired ? 'expired' : 'active'}`}>
                    {reminder.isExpired ? 'منتهي' : 'نشط'}
                </span>
            </div>
            <div className="reminder-icon">
                <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                </svg>
            </div>
            <h3 className="reminder-title">{reminder.title}</h3>
            {reminder.description && (
                <p className="reminder-description">{reminder.description}</p>
            )}
            <div className="reminder-dates">
                <div className="reminder-date">
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 16l-4 -4l4 -4" />
                        <path d="M7 12h10" />
                    </svg>
                    <span>البدء: {formatDate(reminder.startDate)}</span>
                </div>
                <div className="reminder-date">
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 8l4 4l-4 4" />
                        <path d="M7 12h10" />
                    </svg>
                    <span>الانتهاء: {formatDate(reminder.endDate)}</span>
                </div>
            </div>
            <div className="reminder-actions">
                <button className="btn-icon-small" onClick={onEdit} title="تعديل">
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                        <path d="M16 5l3 3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ReminderCard;
