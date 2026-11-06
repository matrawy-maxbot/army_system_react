/**
 * ReminderCard Component - Redesigned
 * بطاقة التذكير - تصميم محسّن
 * 
 * Following the new design architecture:
 * - Clean card layout with border accent
 * - Status badge with dot indicator
 * - Bell icon for notification toggle
 * - Improved details grid
 * - Better visual hierarchy
 */

import React from 'react';

const ReminderCard = ({ reminder, onEdit, onToggle, onViewDetails }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // التحقق من حالة التفعيل (افتراضيًا true للتذكيرات القديمة)
    const isActive = reminder.isActive !== undefined ? reminder.isActive : true;

    // تحديد حالة البطاقة بناءً على التفعيل والانتهاء
    const getCardStatus = () => {
        if (!isActive) return 'paused';
        if (reminder.isExpired) return 'expired';
        return 'active';
    };

    // الحصول على نص البادج
    const getBadgeText = () => {
        if (!isActive) return 'متوقف';
        if (reminder.isExpired) return 'منتهي';
        return 'نشط';
    };

    const cardStatus = getCardStatus();

    return (
        <article 
            className={`reminder-card-new ${cardStatus}`}
            aria-label="بطاقة تذكير"
            onClick={onViewDetails}
            style={{ cursor: 'pointer' }}
        >
            {/* Card Top - Status & Actions */}
            <div className="card-top">
                <span className={`status-badge ${cardStatus}`}>
                    {getBadgeText()}
                </span>
                <div className="top-actions">
                    <button 
                        className={`bell-icon ${isActive ? 'active' : 'inactive'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                        aria-label={isActive ? "إيقاف التنبيه" : "تفعيل التنبيه"}
                        title={isActive ? "إيقاف التنبيه" : "تفعيل التنبيه"}
                        type="button"
                    >
                        {isActive ? (
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path 
                                    d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" 
                                    fill="currentColor"
                                />
                                <path 
                                    d="M10 21h4" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round"
                                />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path 
                                    d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" 
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                />
                                <path 
                                    d="M10 21h4" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round"
                                />
                                <line 
                                    x1="4" 
                                    y1="4" 
                                    x2="20" 
                                    y2="20" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round"
                                />
                            </svg>
                        )}
                    </button>
                    <button 
                        className="edit-btn" 
                        type="button" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }} 
                        aria-label="تعديل البطاقة" 
                        title="تعديل"
                    >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path 
                                d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z"
                                stroke="currentColor" 
                                strokeWidth="1.8" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Card Heading */}
            <div className="card-heading">
                <div className="heading-content">
                    <h2 className="reminder-title-new">{reminder.title}</h2>
                    {reminder.description && (
                        <p className="reminder-description-new">{reminder.description}</p>
                    )}
                </div>
            </div>

            {/* Details Grid */}
            <div className="details-grid">
                {/* Start Date */}
                <div className="detail-item">
                    <span className="detail-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect 
                                x="3.5" 
                                y="5" 
                                width="17" 
                                height="16" 
                                rx="2" 
                                stroke="currentColor" 
                                strokeWidth="1.8"
                            />
                            <path 
                                d="M7 3v4M17 3v4M4 9h16" 
                                stroke="currentColor" 
                                strokeWidth="1.8" 
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                    <span className="detail-text">
                        <span className="detail-label">تاريخ البدء</span>
                        <span className="detail-value">{formatDate(reminder.startDate)}</span>
                    </span>
                </div>

                {/* End Date */}
                <div className="detail-item">
                    <span className="detail-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle 
                                cx="12" 
                                cy="12" 
                                r="8.5" 
                                stroke="currentColor" 
                                strokeWidth="1.8"
                            />
                            <path 
                                d="M12 7v5l3 2" 
                                stroke="currentColor" 
                                strokeWidth="1.8" 
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                    <span className="detail-text">
                        <span className="detail-label">تاريخ الانتهاء</span>
                        <span className="detail-value">{formatDate(reminder.endDate)}</span>
                    </span>
                </div>
            </div>
        </article>
    );
};

export default ReminderCard;
